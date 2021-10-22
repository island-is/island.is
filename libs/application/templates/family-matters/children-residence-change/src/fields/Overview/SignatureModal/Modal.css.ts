import { theme } from '@island.is/island-ui/theme'
import { keyframes, style, styleVariants } from '@vanilla-extract/css'

export const modal = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
})

export const modalContent = style({
  position: 'absolute',
  background: theme.color.white,
  borderRadius: theme.border.radius.large,
  padding: '56px 40px 40px',
  width: '100%',
  height: '100vh',
  textAlign: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      filter: 'drop-shadow(0px 4px 30px rgba(0, 97, 255, 0.16))',
      padding: '64px 56px 48px',
      top: '240px',
      left: '50%',
      width: '90%',
      borderRadius: '8px',
      height: 'auto',
      maxWidth: '500px',
      transform: 'translateX(-50%)',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: '96px 114px 80px',
      maxWidth: '660px',
    },
  },
})

export const logoWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '40px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      marginBottom: '0',
      width: '70px',
      height: '70px',
      position: 'absolute',
      background: theme.color.white,
      left: '50%',
      top: '-35px',
      transform: 'translateX(-50%)',
      borderRadius: '50%',
    },
  },
})

export const controlCodeContainer = style({
  background: theme.color.blue100,
  height: '96px',
  marginTop: theme.spacing[4],
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  textAlign: 'center',
  borderRadius: theme.border.radius.large,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      height: '112px',
    },
  },
})

export const iconContainer = style({
  height: '50px',
  width: '50px',
})

export const controlCode = style({
  color: theme.color.blue400,
  marginLeft: '8px',
})

export const loader = styleVariants({
  general: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noLoader: {
    opacity: 0,
  },
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

export const loadingDot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: theme.color.blue400,
  selectors: {
    '&:not(:last-child)': {
      marginRight: 10,
    },
    '&:nth-child(2)': {
      animationDelay: '0.4s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.8s',
    },
  },
  animation:
    `${dotAnimation} 1.4s forwards cubic-bezier(0.59, 0.01, 0.39, 1) infinite`,
})
