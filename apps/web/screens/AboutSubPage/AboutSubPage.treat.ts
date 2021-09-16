import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const bottomContent = style({
  margin: 'auto',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      padding: `0 ${theme.grid.gutter.mobile * 2}px`,
    },
  },
})
