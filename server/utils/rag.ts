import type { DocChunk } from './pdmshell-docs'
import { getDocs, onDocsUpdated } from './doc-store'

/**
 * Synonym map: maps common user terms to terms found in the documentation.
 * Each key is a term a user might type; the values are terms that should
 * also be considered when scoring documents.
 */
const SYNONYMS: Record<string, string[]> = {
  // Export / convert synonyms
  'export': ['convert', 'save as', 'pdf', 'dxf', 'stp', 'step', 'extensions'],
  'convert': ['export', 'save as', 'pdf', 'dxf', 'stp', 'step'],
  'save as': ['export', 'convert'],
  'pdf': ['export', 'convert', 'extensions'],
  'dxf': ['export', 'convert', 'extensions'],
  'step': ['export', 'convert', 'stp', 'extensions'],
  'stp': ['export', 'convert', 'step', 'extensions'],

  // Rename synonyms
  'rename': ['rename file', 'change name', 'renamefromsource'],
  'rename file': ['rename', 'change name'],
  'change name': ['rename', 'rename file'],

  // Checkout / checkin synonyms
  'check out': ['checkout', 'lock', 'edit'],
  'checkout': ['check out', 'lock', 'edit'],
  'check in': ['checkin', 'unlock', 'commit', 'save'],
  'checkin': ['check in', 'unlock', 'commit', 'save'],
  'undo checkout': ['undocheckout', 'cancel checkout', 'revert'],
  'undocheckout': ['undo checkout', 'cancel checkout', 'revert'],

  // Navigation synonyms
  'change directory': ['cd', 'navigate', 'folder'],
  'navigate': ['cd', 'change directory', 'folder', 'move'],
  'folder': ['directory', 'cd', 'mkdir', 'dir'],
  'directory': ['folder', 'cd', 'mkdir', 'dir'],

  // File listing / directory listing synonyms
  'list': ['dir', 'directory', 'ls', 'files', 'show'],
  'ls': ['dir', 'list', 'files'],
  'dir': ['list', 'ls', 'directory', 'files'],

  // File management synonyms
  'delete': ['remove', 'destroy', 'purge'],
  'remove': ['delete', 'destroy'],
  'copy': ['duplicate', 'clone'],
  'duplicate': ['copy', 'clone'],
  'recover': ['restore', 'undelete', 'bring back'],
  'restore': ['recover', 'undelete', 'bring back'],
  'move': ['movetofolder', 'relocate', 'transfer'],
  'relocate': ['movetofolder', 'move'],

  // Create / add synonyms
  'create': ['mkdir', 'addfolder', 'new', 'add'],
  'new folder': ['mkdir', 'addfolder', 'create'],

  // Variable synonyms
  'variable': ['var', 'setvar', 'getvar', 'data card', 'property'],
  'data card': ['variable', 'setvar', 'getvar', 'property'],
  'property': ['variable', 'data card'],
  'set variable': ['setvar', 'write variable', 'update'],
  'get variable': ['getvar', 'read variable'],
  'update': ['setvar', 'modify', 'change', 'edit', 'set variable'],
  'modify': ['setvar', 'update', 'change', 'edit'],

  // Search synonyms
  'search': ['find', 'query', 'lookup', 'filter'],
  'find': ['search', 'query', 'lookup'],
  'query': ['search', 'find'],
  'wildcard': ['%', 'pattern', 'sql'],

  // Version / revision synonyms
  'version': ['revision', 'ver'],
  'revision': ['version', 'setrevision', 'rev'],
  'rollback': ['frogleap', 'revert', 'restore version'],
  'revert': ['rollback', 'frogleap', 'undo'],

  // Script synonyms
  'script': ['scripting', 'automation', 'pdmshell', 'runscript', 'batch'],
  'automation': ['script', 'scripting', 'workflow', 'batch'],
  'batch': ['script', 'automation', 'bulk', 'csv', 'source'],

  // Authentication synonyms
  'login': ['authenticate', 'sign in', 'connect', 'vault'],
  'authenticate': ['login', 'sign in'],
  'sign in': ['login', 'authenticate'],

  // System synonyms
  'clear': ['cls', 'clearcache', 'clean'],
  'cache': ['clearcache', 'local', 'clear cache'],
  'log': ['dump', 'history', 'session'],
  'reboot': ['restart', 'reset'],

  // Workflow synonyms
  'workflow': ['transition', 'state', 'dispatch'],
  'transition': ['workflow', 'state change', 'dispatch'],
  'dispatch': ['workflow', 'shell command', 'automation'],

  // Reference synonyms
  'references': ['updatereferences', 'broken references', 'fix references'],
  'broken references': ['updatereferences', 'references', 'repair'],
  'migration': ['updatereferences', 'versionupgrade', 'references'],

  // Placeholder / eval synonyms
  'placeholder': ['eval', 'dynamic', 'alias', 'substitution', 'dollar sign'],
  'alias': ['eval', 'placeholder', 'dynamic'],
  'eval': ['placeholder', 'dynamic', 'alias', 'substitution'],

  // BOM synonyms
  'bom': ['bill of materials', 'assembly', 'csv'],
  'bill of materials': ['bom', 'assembly'],

  // Macro synonyms
  'macro': ['runswmacro', 'solidworks macro', 'swp', 'dll', 'vba'],
  'solidworks macro': ['runswmacro', 'macro', 'swp'],

  // Task synonyms
  'task': ['runtask', 'taskscript', 'pdm task'],

  // Instance mode
  'single instance': ['instance', 'mode', 'pdmcli', 'performance'],

  // Short format
  'short format': ['abbreviation', 'shortcut', 'shorthand'],
  'abbreviation': ['short format', 'shortcut', 'shorthand'],

  // Permission synonyms
  'permissions': ['setpermissions', 'access', 'rights', 'security'],
  'access': ['permissions', 'setpermissions', 'rights'],

  // Release notes / changelog synonyms
  'release notes': ['changelog', 'version history', 'updates', 'new features', 'bug fix'],
  'changelog': ['release notes', 'version history', 'updates', 'what\'s new'],
  'what\'s new': ['release notes', 'changelog', 'updates'],

  // License / EULA synonyms
  'license': ['eula', 'agreement', 'terms', 'legal', 'premium', 'free'],
  'eula': ['license', 'agreement', 'terms', 'legal'],
  'pricing': ['license', 'premium', 'free', 'buy', 'purchase'],
  'premium': ['license', 'free', 'paid', 'unlimited']
}

/** Special single-character tokens that have meaning in PDMShell (wildcards, variables). */
const MEANINGFUL_SINGLE_CHARS = new Set(['$', '%'])

/**
 * Tokenize a string: lowercase, split by non-alphanumeric characters,
 * and filter out very short tokens (except meaningful special characters).
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$%]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 || MEANINGFUL_SINGLE_CHARS.has(t))
}

/**
 * Expand query tokens with synonyms. For each token, check if it or any
 * multi-word phrase it's part of has synonyms, and add those to the set.
 */
function expandWithSynonyms(queryTokens: string[], rawQuery: string): string[] {
  const expanded = new Set<string>(queryTokens)
  const lowerQuery = rawQuery.toLowerCase()

  // Check multi-word synonyms against the full query
  for (const [phrase, synonyms] of Object.entries(SYNONYMS)) {
    if (lowerQuery.includes(phrase)) {
      for (const syn of synonyms) {
        for (const token of tokenize(syn)) {
          expanded.add(token)
        }
      }
    }
  }

  // Check single-token synonyms
  for (const token of queryTokens) {
    const synonyms = SYNONYMS[token]
    if (synonyms) {
      for (const syn of synonyms) {
        for (const t of tokenize(syn)) {
          expanded.add(t)
        }
      }
    }
  }

  return Array.from(expanded)
}

/**
 * Compute a relevance score for a document chunk given expanded query tokens.
 * Uses a TF-IDF-inspired approach:
 * - Keyword matches are weighted heavily (3x)
 * - Title matches are weighted heavily (4x)
 * - Category matches are weighted (2x)
 * - Content token frequency is used as TF
 * - Inverse document frequency approximation boosts rare terms
 */
function scoreDocument(
  doc: DocChunk,
  expandedTokens: string[],
  idf: Map<string, number>
): number {
  let score = 0

  const docKeywords = doc.keywords.map(k => k.toLowerCase())
  const titleTokens = tokenize(doc.title)
  const contentTokens = tokenize(doc.content)
  const categoryTokens = tokenize(doc.category)

  // Build a term frequency map for the content
  const contentTF = new Map<string, number>()
  for (const token of contentTokens) {
    contentTF.set(token, (contentTF.get(token) || 0) + 1)
  }

  for (const queryToken of expandedTokens) {
    const idfScore = idf.get(queryToken) || 1

    // Exact keyword match (highest weight)
    for (const kw of docKeywords) {
      if (kw === queryToken) {
        score += 4 * idfScore
      } else if (kw.includes(queryToken) || queryToken.includes(kw)) {
        score += 2 * idfScore
      }
    }

    // Title match
    if (titleTokens.includes(queryToken)) {
      score += 4 * idfScore
    }

    // Category match
    if (categoryTokens.includes(queryToken)) {
      score += 2 * idfScore
    }

    // Content TF-IDF
    const tf = contentTF.get(queryToken) || 0
    if (tf > 0) {
      // Log-scaled TF to prevent very long docs from dominating
      score += (1 + Math.log(tf)) * idfScore
    }
  }

  // Bonus for exact command name match in the doc id
  for (const queryToken of expandedTokens) {
    if (doc.id.toLowerCase() === queryToken) {
      score += 10
    }
  }

  return score
}

/**
 * Build an IDF (Inverse Document Frequency) map across all documents.
 * Tokens that appear in fewer documents get higher IDF scores.
 */
function buildIDFMap(): Map<string, number> {
  const docs = getDocs()
  const docCount = docs.length
  const tokenDocCount = new Map<string, number>()

  for (const doc of docs) {
    const allTokens = new Set<string>([
      ...tokenize(doc.content),
      ...doc.keywords.flatMap(k => tokenize(k)),
      ...tokenize(doc.title),
      ...tokenize(doc.category)
    ])

    for (const token of allTokens) {
      tokenDocCount.set(token, (tokenDocCount.get(token) || 0) + 1)
    }
  }

  const idfMap = new Map<string, number>()
  for (const [token, count] of tokenDocCount) {
    // Standard IDF formula with smoothing
    idfMap.set(token, Math.log((docCount + 1) / (count + 1)) + 1)
  }

  return idfMap
}

// Lazy IDF initialization — computed on first query, cached thereafter
let _idfMap: Map<string, number> | null = null
function getIDFMap(): Map<string, number> {
  if (!_idfMap) {
    _idfMap = buildIDFMap()
  }
  return _idfMap
}

// Invalidate IDF cache when docs are updated from GitHub sync
onDocsUpdated(() => {
  _idfMap = null
})

/** Minimum number of results to return when relevant docs exist. */
const MIN_RESULTS = 5
/** Maximum number of results to return. */
const MAX_RESULTS = 8
/** Documents with scores below this fraction of the top score are excluded from the extended result set. */
const SCORE_THRESHOLD_RATIO = 0.4

/**
 * Retrieve the most relevant PDMShell documentation chunks for a given query.
 *
 * @param query - Natural language query from the user
 * @returns Array of 5-8 most relevant doc content strings
 */
export async function retrievePDMShellDocs(
  query: string
): Promise<string[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) {
    return []
  }

  const idfMap = getIDFMap()
  const expandedTokens = expandWithSynonyms(queryTokens, query)

  // Score each document
  const scored: Array<{ doc: DocChunk, score: number }> = getDocs().map(
    doc => ({
      doc,
      score: scoreDocument(doc, expandedTokens, idfMap)
    })
  )

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Filter out zero-score documents
  const relevant = scored.filter(s => s.score > 0)

  if (relevant.length === 0) {
    // Fallback: return introduction and FAQ if nothing matches
    return getDocs()
      .filter(d => d.id === 'introduction' || d.id === 'faq')
      .map(d => `## ${d.title}\n\n${d.content}`)
  }

  // Take top MIN_RESULTS-MAX_RESULTS based on score distribution
  let resultCount = MIN_RESULTS

  if (relevant.length > MIN_RESULTS) {
    // Include additional results if they have at least SCORE_THRESHOLD_RATIO of the top score
    const topScore = relevant[0]!.score
    const threshold = topScore * SCORE_THRESHOLD_RATIO

    for (let i = MIN_RESULTS; i < Math.min(relevant.length, MAX_RESULTS); i++) {
      if (relevant[i]!.score >= threshold) {
        resultCount = i + 1
      }
    }
  }

  const finalCount = Math.min(resultCount, relevant.length)

  return relevant.slice(0, finalCount).map(({ doc }) => {
    return `## ${doc.title}\n\n${doc.content}`
  })
}
