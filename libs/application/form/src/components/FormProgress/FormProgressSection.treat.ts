import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  transition: 'margin-left .5s ease',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      transition: 'none',
    },
  },
})

export const sectionName = style({
  // Fixes vertical center alignemnt of text and number
  paddingTop: '3px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingTop: 0,
    },
  },
})
