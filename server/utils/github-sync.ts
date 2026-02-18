import { getLastSyncSha, updateDocs } from './doc-store'
import { pdmshellDocs, type DocChunk } from './pdmshell-docs'

const REPO_OWNER = 'BlueByteSystemsInc'
const REPO_NAME = 'PDMShell'
const BRANCH = 'master'
const SRC_PREFIX = 'src/'
const BATCH_SIZE = 10

// Upstream filename typo corrections
const ID_FIXES: Record<string, string> = {
  destory: 'destroy'
}

// Static category map for all known commands and docs
const CATEGORY_MAP: Record<string, string> = {
  // file-management
  addtovault: 'file-management',
  copy: 'file-management',
  copytree: 'file-management',
  delete: 'file-management',
  deletefromsource: 'file-management',
  destroy: 'file-management',
  move: 'file-management',
  movefromsource: 'file-management',
  packandgo: 'file-management',
  print: 'file-management',
  printfromsource: 'file-management',
  recover: 'file-management',
  rename: 'file-management',
  renamefromsource: 'file-management',
  updatereferences: 'file-management',
  // version-control
  checkin: 'version-control',
  checkout: 'version-control',
  frogleap: 'version-control',
  get: 'version-control',
  history: 'version-control',
  setrevision: 'version-control',
  setrevisionfromsource: 'version-control',
  undocheckout: 'version-control',
  versionupgrade: 'version-control',
  versionupgradefromsource: 'version-control',
  // navigation
  cd: 'navigation',
  dir: 'navigation',
  mkdir: 'navigation',
  // variables
  editvars: 'variables',
  getvar: 'variables',
  getvarfromdb: 'variables',
  infovar: 'variables',
  mkvar: 'variables',
  setvar: 'variables',
  setvarsfromsource: 'variables',
  // search
  search: 'search',
  searchfromsource: 'search',
  advancedsearch: 'search',
  whereused: 'search',
  // scripting
  dispatch: 'scripting',
  escapingquotes: 'scripting',
  eval: 'scripting',
  runscript: 'scripting',
  runswmacro: 'scripting',
  runtask: 'scripting',
  scripting: 'scripting',
  scriptsfromtransition: 'scripting',
  taskscript: 'scripting',
  // system
  clearcache: 'system',
  cls: 'system',
  dump: 'system',
  help: 'system',
  inbox: 'system',
  instances: 'system',
  kill: 'system',
  quit: 'system',
  reboot: 'system',
  setpermissions: 'system',
  start: 'system',
  version: 'system',
  // authentication
  login: 'authentication',
  users: 'authentication',
  // export
  bom: 'export',
  export: 'export',
  // general
  eula: 'general',
  faq: 'general',
  freevspremium: 'general',
  howtoinstall: 'general',
  index: 'general',
  introduction: 'general',
  parameter_short_format: 'general',
  releasenotes: 'general'
}

// Build keyword lookup from hardcoded fallback docs for enrichment
const FALLBACK_KEYWORDS = new Map<string, string[]>()
for (const doc of pdmshellDocs) {
  FALLBACK_KEYWORDS.set(doc.id, doc.keywords)
}

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'PDMShell-DocSync'
  }
  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

interface CommitEntry {
  sha: string
}
interface TreeEntry {
  path: string
  type: string
}
interface TreeResponse {
  tree: TreeEntry[]
}

async function getLatestSha(): Promise<string> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${SRC_PREFIX}&per_page=1`
  const res = await fetch(url, { headers: getHeaders() })
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${res.statusText}`)
  }
  const commits = (await res.json()) as CommitEntry[]
  if (!commits.length) {
    throw new Error('No commits found for src/')
  }
  return commits[0]!.sha
}

async function getMdFiles(): Promise<string[]> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`
  const res = await fetch(url, { headers: getHeaders() })
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${res.statusText}`)
  }
  const data = (await res.json()) as TreeResponse
  return data.tree
    .filter(f => f.type === 'blob' && f.path.startsWith(SRC_PREFIX) && f.path.endsWith('.md'))
    .map(f => f.path)
}

async function fetchRaw(path: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${path}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Raw fetch ${res.status}: ${path}`)
  }
  return res.text()
}

// ---------------------------------------------------------------------------
// Markdown parsing
// ---------------------------------------------------------------------------

function normalizeId(filename: string): string {
  const raw = filename.replace(/\.md$/i, '').toLowerCase()
  return ID_FIXES[raw] ?? raw
}

function stripFrontmatter(md: string): { frontmatter: Record<string, string>, body: string } {
  const fm: Record<string, string> = {}
  let body = md

  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (match) {
    const raw = match[1]!
    body = match[2]!
    for (const line of raw.split('\n')) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim()
        const val = line.slice(colonIdx + 1).trim()
        fm[key] = val
      }
    }
  }

  return { frontmatter: fm, body }
}

function extractTitle(frontmatter: Record<string, string>, body: string, id: string): string {
  // Prefer H1 heading — usually more descriptive than frontmatter title
  const h1 = body.match(/^#\s+(.+)$/m)
  if (h1) {
    return h1[1]!
      .replace(/\s*Documentation\s*$/i, '')
      .trim()
  }

  // Fallback to frontmatter title, strip SEO suffixes
  if (frontmatter.title) {
    return frontmatter.title
      .replace(/\s*\|.*$/, '')
      .replace(/\s*Documentation\s*$/i, '')
      .trim()
  }

  return `${id.toUpperCase()} Command`
}

function cleanContent(body: string): string {
  return body
    // Remove H1 heading (title stored separately)
    .replace(/^#\s+.+$/m, '')
    // Convert ## headers to plain section headers
    .replace(/^##\s+/gm, '')
    // Remove code fence markers but keep content inside
    .replace(/^```\w*$/gm, '')
    // Clean blockquote alert syntax
    .replace(/>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\s*/gi, '')
    // Remove blockquote markers from continuation lines
    .replace(/^>\s?/gm, '')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractKeywords(id: string, title: string, content: string): string[] {
  const keywords = new Set<string>()

  // Add the ID itself
  keywords.add(id)

  // Extract meaningful words from title
  const titleWords = title.toLowerCase().match(/[a-z]{3,}/g)
  if (titleWords) {
    const stopWords = new Set(['command', 'documentation', 'the', 'and', 'for', 'from'])
    for (const w of titleWords) {
      if (!stopWords.has(w)) {
        keywords.add(w)
      }
    }
  }

  // Extract parameter names from PARAMETERS section
  const paramSection = content.match(/PARAMETERS:[\s\S]*?(?=\n(?:[A-Z]+:|$))/i)
  if (paramSection) {
    const params = paramSection[0].match(/`(\w+)`/g)
    if (params) {
      for (const p of params) {
        const clean = p.replace(/`/g, '').toLowerCase()
        if (clean.length > 1) {
          keywords.add(clean)
        }
      }
    }
  }

  return Array.from(keywords)
}

function resolveCategory(id: string, content: string): string {
  if (CATEGORY_MAP[id]) {
    return CATEGORY_MAP[id]!
  }

  // Content-based heuristic for unknown/new docs
  const lower = content.toLowerCase()
  if (lower.includes('syntax:') && lower.includes('parameters:')) {
    if (lower.includes('variable') || lower.includes('data card')) return 'variables'
    if (lower.includes('checkout') || lower.includes('checkin') || lower.includes('version')) return 'version-control'
    if (lower.includes('search') || lower.includes('query')) return 'search'
    if (lower.includes('script') || lower.includes('automation')) return 'scripting'
    if (lower.includes('export') || lower.includes('convert')) return 'export'
    if (lower.includes('login') || lower.includes('vault')) return 'authentication'
    if (lower.includes('delete') || lower.includes('copy') || lower.includes('rename') || lower.includes('move')) return 'file-management'
    if (lower.includes('directory') || lower.includes('folder') || lower.includes('navigate')) return 'navigation'
    return 'system'
  }

  return 'general'
}

function mergeKeywords(id: string, autoKeywords: string[]): string[] {
  const fallback = FALLBACK_KEYWORDS.get(id)
  if (!fallback) return autoKeywords

  const merged = new Set<string>(autoKeywords)
  for (const kw of fallback) {
    merged.add(kw)
  }
  return Array.from(merged)
}

function parseMarkdownToDocChunk(
  filePath: string,
  raw: string
): DocChunk {
  const filename = filePath.split('/').pop()!
  const id = normalizeId(filename)
  const { frontmatter, body } = stripFrontmatter(raw)
  const title = extractTitle(frontmatter, body, id)
  const content = cleanContent(body)
  const autoKeywords = extractKeywords(id, title, content)
  const keywords = mergeKeywords(id, autoKeywords)
  const category = resolveCategory(id, content)

  return { id, title, content, keywords, category }
}

// ---------------------------------------------------------------------------
// Batched fetching
// ---------------------------------------------------------------------------

async function fetchInBatches(
  paths: string[]
): Promise<Array<{ path: string, content: string } | null>> {
  const results: Array<{ path: string, content: string } | null> = []

  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const batch = paths.slice(i, i + BATCH_SIZE)
    const settled = await Promise.allSettled(
      batch.map(async (path) => {
        const content = await fetchRaw(path)
        return { path, content }
      })
    )

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.warn(`[doc-sync] Failed to fetch: ${result.reason}`)
        results.push(null)
      }
    }
  }

  return results
}

// ---------------------------------------------------------------------------
// Main sync entry point
// ---------------------------------------------------------------------------

export async function syncDocs(): Promise<boolean> {
  try {
    // 1. Check for changes
    const latestSha = await getLatestSha()
    const storedSha = getLastSyncSha()

    if (latestSha === storedSha) {
      console.log('[doc-sync] Docs up to date')
      return false
    }

    // 2. Discover markdown files
    const files = await getMdFiles()
    if (!files.length) {
      console.warn('[doc-sync] No markdown files found')
      return false
    }

    // 3. Fetch all files in batches of 10
    const fetched = await fetchInBatches(files)
    const docs: DocChunk[] = []

    for (const result of fetched) {
      if (!result) continue
      try {
        const doc = parseMarkdownToDocChunk(result.path, result.content)
        docs.push(doc)
      } catch (err) {
        console.warn(`[doc-sync] Failed to parse ${result.path}:`, err)
      }
    }

    if (!docs.length) {
      console.warn('[doc-sync] All file parses failed, keeping current docs')
      return false
    }

    // 4. Hot-swap the in-memory store
    updateDocs(docs, latestSha)
    console.log(`[doc-sync] Synced ${docs.length} docs (SHA: ${latestSha.slice(0, 7)})`)
    return true
  } catch (err) {
    console.warn('[doc-sync] Sync failed, keeping current docs:', err)
    return false
  }
}
