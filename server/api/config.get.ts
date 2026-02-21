export default defineEventHandler((event) => {
  const sessionId = getSessionId(event)
  return {
    ...getClientConfig(),
    quota: getQuotaState(sessionId)
  }
})
