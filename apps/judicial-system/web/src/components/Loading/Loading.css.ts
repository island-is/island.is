import { keyframes, style, styleVariants } from '@vanilla-extract/css'
export const loadingContainer = style({
  overflow: 'hidden',
})

const containerAnimation = keyframes({
  from: {
    transform: 'translate3d(0, 100%, 0)',
  },
  to: {
    transform: 'translate3d(0, 0, 0)',
  },
})

export const animatedLoadingContainer = style({
  animationName: containerAnimation,
  animationDuration: '.5s',
  animationDelay: '1s',
  animationFillMode: 'forwards',
  animationTimingFunction: 'ease-out',
  transform: 'translate3d(0, 100%, 0)',
})

const fadeAnimation = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

export const variants = styleVariants({
  first: {
    animationName: fadeAnimation,
    animationDuration: '1s',
    animationDelay: '1s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
  second: {
    animationName: fadeAnimation,
    animationDuration: '2s',
    animationDelay: '1.8s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
  third: {
    animationName: fadeAnimation,
    animationDuration: '3s',
    animationDelay: '2.6s',
    animationFillMode: 'forwards',
    opacity: 0,
  },
})
