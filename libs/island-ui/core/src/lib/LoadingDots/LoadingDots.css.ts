import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const single = style({})

export const large = style({})
export const small = style({})

export const container = style({
  display: 'inline-flex',
  flexWrap: 'nowrap',
  overflow: 'hidden',
  lineHeight: 0,
})

const gradient = `linear-gradient(135deg,
  #0161FD 0%,
  #3F46D2 24.57%,
  #812EA4 50.79%,
  #C21578 77.26%,
  #FD0050 100%
)`

const gradient1 = `linear-gradient(90deg,
  #0161FD 0%,
  #3F46D2 24.57%
)`

const gradient2 = `linear-gradient(90deg,
  #3F46D2 0%,
  #812EA4 100%
)`

const gradient3 = `linear-gradient(90deg,
  #812EA4 0%,
  #C21578 77.26%,
  #FD0050 100%
)`

export const colors = styleVariants({
  blue: {},
  white: {},
  gradient: {},
})

const dotAnimation = keyframes({
  '0%': {
    transform: 'scale(1)',
    opacity: 1,
  },
  '50%': {
    transform: 'scale(0.8)',
    opacity: 0.4,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const dot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  selectors: {
    [`${large} &`]: {
      width: 16,
      height: 16,
    },
    [`${small} &`]: {
      width: 4,
      height: 4,
    },
    '&:not(:last-child)': {
      marginRight: 10,
    },
    [`${small} &:not(:last-child)`]: {
      marginRight: 5,
    },
    [`${large} &:not(:last-child)`]: {
      marginRight: 20,
    },
    '&:nth-child(2)': {
      animationDelay: '0.4s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.8s',
    },
    [`${single} &:nth-child(2), ${single} &:nth-child(3)`]: {
      display: 'none',
    },
    [`${single} &`]: {
      width: 16,
      height: 16,
      marginRight: 0,
    },
    [`${large}${single} &`]: {
      width: 32,
      height: 32,
      marginRight: 0,
    },
    [`${small}${single} &`]: {
      width: 8,
      height: 8,
      marginRight: 0,
    },
    [`${colors.blue} &`]: {
      background: theme.color.blue400,
    },
    [`${colors.white} &`]: {
      background: theme.color.white,
    },
    [`${colors.gradient} &:first-child`]: {
      background: gradient1,
    },
    [`${colors.gradient} &:nth-child(2)`]: {
      background: gradient2,
    },
    [`${colors.gradient} &:last-child`]: {
      background: gradient3,
    },
    [`${single}${colors.gradient} &`]: {
      background: gradient,
    },
  },
  animation: `${dotAnimation} 1.4s forwards cubic-bezier(0.59, 0.01, 0.39, 1) infinite`,
})
