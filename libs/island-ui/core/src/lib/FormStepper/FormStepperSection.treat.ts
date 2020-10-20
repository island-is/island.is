import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
})

export const name = style({
  marginRight: 20,

  whiteSpace: 'nowrap',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginRight: 0,

      whiteSpace: 'inherit',
    },
  },
})

export const nameWithActiveSubSections = style({
  marginRight: 0,
})
