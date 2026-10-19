import type { Transition } from 'motion/react'

/**
 * The timings the web's motion components share, so a block that opens on
 * one screen opens the same way on every other.
 */

// Something appearing in or leaving the flow of a page: short, and easing
// out so it settles rather than stops.
export const enterExitTransition: Transition = {
  duration: 0.25,
  ease: 'easeOut',
}

// The same change of state for users who have asked for reduced motion:
// made at once, so what opens still opens.
export const instantTransition: Transition = {
  duration: 0,
}
