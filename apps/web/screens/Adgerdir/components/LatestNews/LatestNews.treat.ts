import { style } from 'treat'
import { theme } from '@island.is/island-ui/core'

export const indent = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginLeft: '130px',
    },
  },
})
