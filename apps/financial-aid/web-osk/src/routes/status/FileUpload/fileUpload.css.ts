import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
  transition: 'color .2s ease',
  selectors: {
    '&:hover': {
      color: theme.color.blueberry400,
      textDecoration: 'underline',
    },
  },
})
