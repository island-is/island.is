import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  margin: '0 -8px',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      justifyContent: 'space-between',
    },
  },
})
