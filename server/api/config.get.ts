export default defineEventHandler((event) => {
  const sessionId = getSessionId(event)
  return {
    quota: getQuotaState(sessionId)
  }
})
