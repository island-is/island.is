import { keyframes, style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: 546,
})

export const inputWrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 26,
  transform: 'translateY(-50%)',
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
