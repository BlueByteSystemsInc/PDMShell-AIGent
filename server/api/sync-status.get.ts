import { getSyncStatus } from '../utils/doc-store'

export default defineEventHandler(() => {
  return getSyncStatus()
})
