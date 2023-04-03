import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const drawer = style({
  position: 'fixed',
  top: 0,
  width: '100%',
  height: '100vh',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  opacity: 1,
  transition: 'transform 400ms ease-in-out',
  selectors: {
    '&[data-enter]': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  ...themeUtils.responsiveStyle({
    md: {
      width: '80%',
    },
    lg: {
      width: 902,
    },
  }),
})

export const position = styleVariants({
  left: {
    left: 0,
    transform: 'translate3d(-100%, 0, 0)',
  },
  right: {
    right: 0,
    transform: 'translate3d(100%, 0, 0)',
  },
})

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['2'],
  right: theme.spacing['2'],
  zIndex: 2,
})
