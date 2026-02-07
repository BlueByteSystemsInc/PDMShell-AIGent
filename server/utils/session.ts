import type { H3Event } from 'h3'

export function getSessionId(event: H3Event): string {
  let sessionId = getCookie(event, 'pdmshell-session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    setCookie(event, 'pdmshell-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
  }
  return sessionId
}
