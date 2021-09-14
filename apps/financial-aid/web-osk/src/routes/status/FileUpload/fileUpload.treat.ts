import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const link = style({
  selectors: {
    '&:first-child': {
      color: theme.color.blue400,
      textDecoration: 'underline',
      transition: 'color .2s ease',
    },
    '&:hover:first-child': {
      color: theme.color.blueberry400,
      textDecoration: 'underline',
    },
  },
})
