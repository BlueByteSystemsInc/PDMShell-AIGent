export default defineEventHandler(() => {
  return {
    ...getClientConfig(),
    quota: getQuotaState()
  }
})
