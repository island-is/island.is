import { styleVariants, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  height: '100%',
  margin: '0 auto',
  padding: theme.spacing[1],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '80%',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      width: '65%',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      width: '50%',
    },
  },
})

export const iframeContainer = style({
  margin: 'auto',
  aspectRatio: '1 / 1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  maxWidth: 700,
})

export const loaderContainer = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
})
