import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  width: '100vw',
  overflowX: 'hidden',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: 'auto',
    },
  },
})
