export interface QuotaMetric {
  used: number
  limit: number
  remaining: number
  resetsAt: number
}

export interface QuotaState {
  rpm: QuotaMetric
  rpd: QuotaMetric
  tpm: QuotaMetric
  tpd: QuotaMetric
}

interface Window {
  used: number
  resetsAt: number
}

type WindowSet = Record<string, Window>

// Per-session limits (protect individual users from each other)
const SESSION_LIMITS = {
  rpm: 10,
  rpd: 200,
  tpm: 6000,
  tpd: 50000
} as const

// Global limits (Groq API key shared across all sessions)
const GLOBAL_LIMITS = {
  rpm: 30,
  rpd: 1000,
  tpm: 12000,
  tpd: 100000
} as const

const ONE_MINUTE = 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000
const MAX_SESSIONS = 500
const SESSION_TTL = 24 * 60 * 60 * 1000 // Evict sessions idle for 24h

// ---------------------------------------------------------------------------
// Window helpers
// ---------------------------------------------------------------------------

function createWindows(): WindowSet {
  return {
    rpm: { used: 0, resetsAt: Date.now() + ONE_MINUTE },
    rpd: { used: 0, resetsAt: Date.now() + ONE_DAY },
    tpm: { used: 0, resetsAt: Date.now() + ONE_MINUTE },
    tpd: { used: 0, resetsAt: Date.now() + ONE_DAY }
  }
}

function resetIfExpired(w: Window, duration: number) {
  if (Date.now() >= w.resetsAt) {
    w.used = 0
    w.resetsAt = Date.now() + duration
  }
}

function resetAllExpired(ws: WindowSet) {
  resetIfExpired(ws.rpm!, ONE_MINUTE)
  resetIfExpired(ws.rpd!, ONE_DAY)
  resetIfExpired(ws.tpm!, ONE_MINUTE)
  resetIfExpired(ws.tpd!, ONE_DAY)
}

function buildMetric(w: Window, limit: number): QuotaMetric {
  const used = Math.min(w.used, limit)
  return {
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    resetsAt: w.resetsAt
  }
}

// ---------------------------------------------------------------------------
// Global windows (tracks Groq API-level usage)
// ---------------------------------------------------------------------------

const globalWindows: WindowSet = createWindows()

// ---------------------------------------------------------------------------
// Per-session windows
// ---------------------------------------------------------------------------

interface SessionEntry {
  windows: WindowSet
  lastAccess: number
}

const sessions = new Map<string, SessionEntry>()

function getSessionWindows(sessionId: string): WindowSet {
  let entry = sessions.get(sessionId)
  if (!entry) {
    // Evict oldest sessions if at capacity
    if (sessions.size >= MAX_SESSIONS) {
      let oldestKey: string | null = null
      let oldestTime = Infinity
      for (const [key, val] of sessions) {
        if (val.lastAccess < oldestTime) {
          oldestTime = val.lastAccess
          oldestKey = key
        }
      }
      if (oldestKey) sessions.delete(oldestKey)
    }
    entry = { windows: createWindows(), lastAccess: Date.now() }
    sessions.set(sessionId, entry)
  }
  entry.lastAccess = Date.now()
  return entry.windows
}

// Periodic cleanup of stale sessions (every 10 min)
setInterval(() => {
  const cutoff = Date.now() - SESSION_TTL
  for (const [key, entry] of sessions) {
    if (entry.lastAccess < cutoff) {
      sessions.delete(key)
    }
  }
}, 10 * 60 * 1000).unref()

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getQuotaState(sessionId?: string): QuotaState {
  // Return the most restrictive view (min of session and global remaining)
  resetAllExpired(globalWindows)

  if (!sessionId) {
    return {
      rpm: buildMetric(globalWindows.rpm!, GLOBAL_LIMITS.rpm),
      rpd: buildMetric(globalWindows.rpd!, GLOBAL_LIMITS.rpd),
      tpm: buildMetric(globalWindows.tpm!, GLOBAL_LIMITS.tpm),
      tpd: buildMetric(globalWindows.tpd!, GLOBAL_LIMITS.tpd)
    }
  }

  const sw = getSessionWindows(sessionId)
  resetAllExpired(sw)

  // Show the tighter of session vs global for each metric
  const keys = ['rpm', 'rpd', 'tpm', 'tpd'] as const
  const result = {} as QuotaState
  for (const key of keys) {
    const sessionMetric = buildMetric(sw[key]!, SESSION_LIMITS[key])
    const globalMetric = buildMetric(globalWindows[key]!, GLOBAL_LIMITS[key])
    result[key] = sessionMetric.remaining <= globalMetric.remaining ? sessionMetric : globalMetric
  }
  return result
}

export function recordRequest(sessionId: string, tokenCount: number = 0) {
  // Update both session and global windows
  const sw = getSessionWindows(sessionId)
  resetAllExpired(sw)
  resetAllExpired(globalWindows)

  for (const ws of [sw, globalWindows]) {
    ws.rpm!.used += 1
    ws.rpd!.used += 1
    ws.tpm!.used += tokenCount
    ws.tpd!.used += tokenCount
  }
}

export function reconcileFromHeaders(headers: Record<string, string>) {
  // Groq headers reflect account-level usage — update global windows only
  resetAllExpired(globalWindows)

  const remainingRequests = headers['x-ratelimit-remaining-requests']
  const remainingTokens = headers['x-ratelimit-remaining-tokens']

  if (remainingRequests) {
    const remaining = parseInt(remainingRequests, 10)
    if (!isNaN(remaining)) {
      globalWindows.rpd!.used = GLOBAL_LIMITS.rpd - remaining
    }
  }

  if (remainingTokens) {
    const remaining = parseInt(remainingTokens, 10)
    if (!isNaN(remaining)) {
      globalWindows.tpm!.used = GLOBAL_LIMITS.tpm - remaining
    }
  }
}

export function checkQuota(sessionId: string): { allowed: boolean, reason?: string } {
  const sw = getSessionWindows(sessionId)
  resetAllExpired(sw)
  resetAllExpired(globalWindows)

  // Check session limits
  if (sw.rpm!.used >= SESSION_LIMITS.rpm) {
    return { allowed: false, reason: 'Rate limit exceeded: too many requests per minute. Try again shortly.' }
  }
  if (sw.rpd!.used >= SESSION_LIMITS.rpd) {
    return { allowed: false, reason: 'Daily request limit reached. Resets tomorrow.' }
  }
  if (sw.tpm!.used >= SESSION_LIMITS.tpm) {
    return { allowed: false, reason: 'Token limit per minute exceeded. Try again shortly.' }
  }
  if (sw.tpd!.used >= SESSION_LIMITS.tpd) {
    return { allowed: false, reason: 'Daily token limit reached. Resets tomorrow.' }
  }

  // Check global limits
  if (globalWindows.rpm!.used >= GLOBAL_LIMITS.rpm) {
    return { allowed: false, reason: 'Service is busy. Too many requests per minute — try again shortly.' }
  }
  if (globalWindows.rpd!.used >= GLOBAL_LIMITS.rpd) {
    return { allowed: false, reason: 'Service daily limit reached. Resets tomorrow.' }
  }
  if (globalWindows.tpm!.used >= GLOBAL_LIMITS.tpm) {
    return { allowed: false, reason: 'Service token limit per minute exceeded. Try again shortly.' }
  }
  if (globalWindows.tpd!.used >= GLOBAL_LIMITS.tpd) {
    return { allowed: false, reason: 'Service daily token limit reached. Resets tomorrow.' }
  }

  return { allowed: true }
}
