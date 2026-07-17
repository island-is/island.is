import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const menuItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `0 1px 0 0 ${theme.color.borderPrimary}`,
    },
  },
})
