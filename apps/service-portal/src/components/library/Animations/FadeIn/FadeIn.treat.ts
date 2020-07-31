import { style } from 'treat'

export const wrapper = style({
  opacity: 0,
  '@keyframes': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  animation: '@keyframes 300ms linear forwards',
})
