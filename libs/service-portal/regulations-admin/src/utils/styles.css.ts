import { style, keyframes } from '@vanilla-extract/css'

const fadeAnimationKey = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

export const animated = style({
  animationName: fadeAnimationKey,
  animationDuration: 'calc(var(--fade-duration, 1000) * 1ms)',
  animationDelay: 'calc(var(--fade-delay, 0) * 1ms)',
  animationTimingFunction: 'ease-in-out',
})
export const fadeOut = style({})
// --fade-duration
// --fade-delay
