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
