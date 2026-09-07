import { router } from 'expo-router'

// A rapid double-tap fires `onPress` twice before the screen transition
// starts, so `router.push` runs twice and the destination is pushed onto the
// stack twice. Ignore a repeat push to the same target within a short window.
const DOUBLE_TAP_WINDOW_MS = 1000

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
