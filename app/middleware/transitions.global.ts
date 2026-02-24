export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  // Only disable view transitions for chat-to-chat navigation
  if (!to.params.id || !from.params.id) return
  to.meta.viewTransition = false
})
