import { keyframes, style } from '@vanilla-extract/css'

const scaleAnimation = keyframes({
  '50%': {
    transform: 'scale(0.95)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const animate = style({
  transformOrigin: '50% 50%',
  animation: `${scaleAnimation} ease-in-out infinite alternate`,
  selectors: {
    '&:nth-child(1)': {
      animationDuration: '3100ms',
      animationDelay: '-100ms',
    },
    '&:nth-child(2)': {
      animationDuration: '3200ms',
    },
    '&:nth-child(3)': {
      animationDuration: '4000ms',
      animationDelay: '-2000ms',
    },
    '&:nth-child(4)': {
      animationDuration: '3800ms',
      animationDelay: '-200ms',
    },
    '&:nth-child(5)': {
      animationDuration: '2800ms',
      animationDelay: '-2000ms',
    },
    '&:nth-child(6)': {
      animationDuration: '3200ms',
      animationDelay: '-700ms',
    },
    '&:nth-child(7)': {
      animationDuration: '3400ms',
    },
    '&:nth-child(8)': {
      animationDuration: '3100ms',
      animationDelay: '-2700ms',
    },
    '&:nth-child(9)': {
      animationDuration: '4200ms',
    },
  },
})
