import { router } from 'expo-router'

// A rapid double-tap fires `onPress` twice before the screen transition
// starts, so `router.push` runs twice and the destination is pushed onto the
// stack twice. Ignore a repeat push to the same target within a short window.
// Keep the window just above a double-tap: the state is never cleared, so a
// longer one would also swallow a deliberate re-open after going back.
const DOUBLE_TAP_WINDOW_MS = 400

let lastKey: string | null = null
let lastPushedAt = 0

export function pushOnce(href: Parameters<typeof router.push>[0]) {
  const key = typeof href === 'string' ? href : JSON.stringify(href)
  const now = Date.now()
  if (key === lastKey && now - lastPushedAt < DOUBLE_TAP_WINDOW_MS) {
    return
  }
  lastKey = key
  lastPushedAt = now
  router.push(href)
}
