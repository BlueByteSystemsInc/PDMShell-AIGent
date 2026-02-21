import { syncDocs } from '../utils/github-sync'

const SYNC_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

function handleSyncError(err: unknown, context: string) {
  const message = err instanceof Error ? err.message : String(err)
  if (message.includes('403') || message.includes('429')) {
    console.warn(`[doc-sync] ${context}: rate limited — will retry next interval`)
  } else if (message.includes('ENOTFOUND') || message.includes('fetch failed')) {
    console.warn(`[doc-sync] ${context}: network error — ${message}`)
  } else {
    console.error(`[doc-sync] ${context}: ${message}`)
  }
}

export default defineNitroPlugin((nitro) => {
  // Fire-and-forget initial sync — app serves immediately with fallback docs
  syncDocs().catch(err => handleSyncError(err, 'startup sync failed'))

  // Periodic sync every 30 minutes
  const interval = setInterval(() => {
    syncDocs().catch(err => handleSyncError(err, 'periodic sync failed'))
  }, SYNC_INTERVAL_MS)

  // Cleanup on server close (prevents timer leaks during HMR)
  nitro.hooks.hook('close', () => {
    clearInterval(interval)
  })
})
