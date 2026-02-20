import { globalStyle, keyframes, style } from '@vanilla-extract/css'

export const inputWrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
})

export const nationalIdInput = style([
  inputWrapper,
  {
    width: 270,
    flexShrink: 0,
  },
])

globalStyle(`${inputWrapper} input`, {
  paddingRight: 0,
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 16,
  transform: 'translateY(-50%)',
  marginTop: 11, // offset label
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
