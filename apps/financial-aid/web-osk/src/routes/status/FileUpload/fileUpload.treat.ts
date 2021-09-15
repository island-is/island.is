import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const widthAlmostFull = style({
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      gridColumn: 'span 7',
    },
  },
})
