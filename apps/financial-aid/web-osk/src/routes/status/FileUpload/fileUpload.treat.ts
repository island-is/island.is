import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const commentContainer = style({
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: '2/10',
    },
  },
})
