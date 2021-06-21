import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const marginTopItems = style({
  marginTop: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: theme.spacing[3],
    },
  },
})
