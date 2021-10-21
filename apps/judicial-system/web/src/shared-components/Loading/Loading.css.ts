import { style, styleMap } from 'treat'
export const loadingContainer = style({
  overflow: 'hidden',
})

export const animatedLoadingContainer = style({
  '@keyframes': {
    from: {
      transform: 'translate3d(0, 100%, 0)',
    },
    to: {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  animationDuration: '.5s',
  animationDelay: '1s',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  transform: 'translate3d(0, 100%, 0)',
})

export const variants = styleMap({
  first: {
    '@keyframes': {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    animationDuration: '1s',
    animationDelay: '1s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
  second: {
    '@keyframes': {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    animationDuration: '2s',
    animationDelay: '1.8s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
  third: {
    '@keyframes': {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
    },
    animationDuration: '3s',
    animationDelay: '2.6s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
})
