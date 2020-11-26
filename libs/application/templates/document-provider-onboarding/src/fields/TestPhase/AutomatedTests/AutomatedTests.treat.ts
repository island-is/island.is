import { style } from 'treat'
export const isLoadingContainer = style({
  opacity: 0.85,
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.85,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})
