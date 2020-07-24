import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const applicationContainer = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',
    },
  },
})

export const sidebarContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '0 0 25%',
    },
  },
})

export const screenContainer = style({
  borderTopWidth: 1,
  borderStyle: theme.border.style.solid,
  borderColor: theme.color.blue200,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flex: '0 0 75%',
    },
  },
})
