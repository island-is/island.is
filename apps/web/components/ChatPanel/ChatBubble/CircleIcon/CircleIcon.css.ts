import { keyframes, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
      border: `2px solid ${theme.color.mint400}`,
    },
  },
})

const slideInAnimation = keyframes({
  from: {
    scale: '0%',
    transformOrigin: '70% 70%',
    opacity: '0',
  },
  to: {
    scale: '100%',
    transformOrigin: '60% 60%',
    opacity: '1',
  },
})

export const slideIn = style({
  animation: `${slideInAnimation} 0.75s ease-out 1 forwards`,
})

const rotateClockwiseAnimation = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '50%': {
    transform: 'rotate(10deg)',
  },
  '100%': {
    transform: 'rotate(0deg)',
  },
})

const rotateCounterClockwiseAnimation = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '50%': {
    transform: 'rotate(-10deg)',
  },
  '100%': {
    transform: 'rotate(0deg)',
  },
})

export const rotateClockwise = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${rotateClockwiseAnimation} 2s ease-in-out forwards 2`,
})

export const rotateCounterClockwise = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${rotateCounterClockwiseAnimation} 2s ease-in-out forwards 2`,
})

export const infiniteRotateClockwise = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${rotateClockwiseAnimation} 2s ease-in-out infinite`,
})

export const infiniteRotateCounterClockwise = style({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${rotateCounterClockwiseAnimation} 2s ease-in-out infinite`,
})

const opacityAnimation = keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
})

export const breathe = style({
  opacity: 0,
  animation: `${opacityAnimation} 2s ease-in-out 0.1s forwards 2`,
})

export const infiniteBreathe = style({
  animation: `${opacityAnimation} 2s ease-in-out infinite`,
})
