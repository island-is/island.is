import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const applicationContainer = style({
  flexDirection: 'column',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
    },
  },
})

export const sidebarContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '0 0 30%',
    },
  },
})

export const screenContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '0 0 70%',
    },
  },
})
