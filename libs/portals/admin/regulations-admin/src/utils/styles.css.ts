import { style, keyframes } from '@vanilla-extract/css'

const fadeAnimationKey = keyframes({
  '0%': {
    opacity: 1,
    maxHeight: 100,
    overflow: 'hidden',
  },
  '50%': {
    opacity: 0.5,
    maxHeight: 100,
    overflow: 'hidden',
  },
  '100%': {
    opacity: 0,
    maxHeight: 0,
    overflow: 'hidden',
  },
})

export const fadeOut = style({
  animationName: fadeAnimationKey,
  animationDuration: 'calc(var(--fade-duration, 1000) * 1ms)',
  animationDelay: 'calc(var(--fade-delay, 0) * 1ms)',
  animationTimingFunction: 'ease-in-out',
  animationFillMode: 'forwards',
})
