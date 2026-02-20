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

const LIMITS = {
  rpm: 30,
  rpd: 1000,
  tpm: 12000,
  tpd: 100000
} as const

const ONE_MINUTE = 60 * 1000
const ONE_DAY = 24 * 60 * 60 * 1000

const windows: Record<string, Window> = {
  rpm: { used: 0, resetsAt: Date.now() + ONE_MINUTE },
  rpd: { used: 0, resetsAt: Date.now() + ONE_DAY },
  tpm: { used: 0, resetsAt: Date.now() + ONE_MINUTE },
  tpd: { used: 0, resetsAt: Date.now() + ONE_DAY }
}

function resetIfExpired(key: string, duration: number) {
  const w = windows[key]!
  if (Date.now() >= w.resetsAt) {
    w.used = 0
    w.resetsAt = Date.now() + duration
  }
}

function resetAllExpired() {
  resetIfExpired('rpm', ONE_MINUTE)
  resetIfExpired('rpd', ONE_DAY)
  resetIfExpired('tpm', ONE_MINUTE)
  resetIfExpired('tpd', ONE_DAY)
}

function buildMetric(key: keyof typeof LIMITS): QuotaMetric {
  const w = windows[key]!
  const limit = LIMITS[key]
  const used = Math.min(w.used, limit)
  return {
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    resetsAt: w.resetsAt
  }
}

export function getQuotaState(): QuotaState {
  resetAllExpired()
  return {
    rpm: buildMetric('rpm'),
    rpd: buildMetric('rpd'),
    tpm: buildMetric('tpm'),
    tpd: buildMetric('tpd')
  }
}

export function recordRequest(tokenCount: number = 0) {
  resetAllExpired()
  windows.rpm!.used += 1
  windows.rpd!.used += 1
  windows.tpm!.used += tokenCount
  windows.tpd!.used += tokenCount
}

export function reconcileFromHeaders(headers: Record<string, string>) {
  // Groq returns these headers on every response
  const remainingRequests = headers['x-ratelimit-remaining-requests']
  const remainingTokens = headers['x-ratelimit-remaining-tokens']

  if (remainingRequests) {
    const remaining = parseInt(remainingRequests, 10)
    if (!isNaN(remaining)) {
      // This reflects RPD remaining — sync our RPD window
      windows.rpd!.used = LIMITS.rpd - remaining
    }
  }

  if (remainingTokens) {
    const remaining = parseInt(remainingTokens, 10)
    if (!isNaN(remaining)) {
      // This reflects TPM remaining — sync our TPM window
      windows.tpm!.used = LIMITS.tpm - remaining
    }
  }
}

export function checkQuota(): { allowed: boolean, reason?: string } {
  resetAllExpired()

  if (windows.rpm!.used >= LIMITS.rpm) {
    return { allowed: false, reason: 'Rate limit exceeded: too many requests per minute. Try again shortly.' }
  }
  if (windows.rpd!.used >= LIMITS.rpd) {
    return { allowed: false, reason: 'Daily request limit reached. Resets tomorrow.' }
  }
  if (windows.tpm!.used >= LIMITS.tpm) {
    return { allowed: false, reason: 'Token limit per minute exceeded. Try again shortly.' }
  }
  if (windows.tpd!.used >= LIMITS.tpd) {
    return { allowed: false, reason: 'Daily token limit reached. Resets tomorrow.' }
  }

  return { allowed: true }
}
