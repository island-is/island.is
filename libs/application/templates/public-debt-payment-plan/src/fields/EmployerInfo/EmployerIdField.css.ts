import { keyframes, style } from '@vanilla-extract/css'

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  right: 26,
  bottom: 24,
})

export const movingIcon = style({
  position: 'absolute',
  lineHeight: 0,
  bottom: 8,
  right: 26,
})

export const loadingIcon = style({
  animationName: keyframes({
    from: {
      transform: 'translateY(-50%) rotate(0deg)',
    },
    to: {
      transform: 'translateY(-50%) rotate(360deg)',
    },
  }),
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
})
