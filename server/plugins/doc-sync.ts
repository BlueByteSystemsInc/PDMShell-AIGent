import { syncDocs } from '../utils/github-sync'

const SYNC_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

export default defineNitroPlugin((nitro) => {
  // Fire-and-forget initial sync — app serves immediately with fallback docs
  syncDocs().catch(() => {})

  // Periodic sync every 30 minutes
  const interval = setInterval(() => {
    syncDocs().catch(() => {})
  }, SYNC_INTERVAL_MS)

  // Cleanup on server close (prevents timer leaks during HMR)
  nitro.hooks.hook('close', () => {
    clearInterval(interval)
  })
})
