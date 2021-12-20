import { keyframes, style } from '@vanilla-extract/css'

export const inputWrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '67%',
  right: 8,
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
