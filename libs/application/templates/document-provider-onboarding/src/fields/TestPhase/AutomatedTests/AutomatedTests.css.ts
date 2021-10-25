import { style, keyframes } from '@vanilla-extract/css'

export const isLoadingContainer = style({
  opacity: 0.85,
  animationName: keyframes({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.85,
    },
  }),
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})
