import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

const MOBILE = `screen and (max-width: ${theme.breakpoints.md}px)`

export const layoutRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  '@media': {
    [MOBILE]: {
      flexDirection: 'column',
    },
  },
})

export const navColumn = style({
  width: '33.333%',
  flexShrink: 0,
  paddingRight: '16px',
  '@media': {
    [MOBILE]: {
      width: '100%',
      paddingRight: 0,
    },
  },
})

export const mainContentColumn = style({
  flex: 1,
  minWidth: 0,
  '@media': {
    [MOBILE]: {
      width: '100%',
    },
  },
})

export const mobileNavToggle = style({
  display: 'none',
  '@media': {
    [MOBILE]: {
      display: 'block',
    },
  },
})

export const mobileNavHidden = style({
  '@media': {
    [MOBILE]: {
      display: 'none',
    },
  },
})
