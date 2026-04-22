// Shared visual tokens for Header / DesktopNav / MobileNav so shadow and
// fade values stay in sync across the three surfaces. Change a value here
// and every surface picks it up.

export const NAV_SHADOW_COLOR = 'rgba(0, 97, 255, 0.16)'
export const NAV_SHADOW = `0 4px 30px 0 ${NAV_SHADOW_COLOR}`

// Numeric form so React-side timers (e.g. the dropdown top-mask window)
// can stay in sync with the CSS duration automatically.
export const NAV_TRANSITION_DURATION_MS = 200
export const NAV_TRANSITION_DURATION = `${NAV_TRANSITION_DURATION_MS}ms`
export const NAV_TRANSITION_EASING = 'ease'
