import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const leftColumn = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
})

export const imageWrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  height: '100%',
})

export const decorativeImage = style({
  position: 'absolute',
  top: '-120px',
  right: 0,
  width: '239px',
  height: '239px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg - 1}px)`]: {
      display: 'none',
    },
  },
})

export const contactLinksWrapper = style({
  position: 'relative',
  zIndex: 1,
  marginTop: 0,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      // Keep the contact links anchored below the decorative image on lg/xl.
      marginTop: '75px',
    },
  },
})
