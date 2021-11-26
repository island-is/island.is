import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const tableWrapper = style({
  width: '100%',
})

export const searchInput = style({
  width: '100%',
  fontSize: '42px',
  fontWeight: 600,
  lineHeight: '52px',
  border: 'none',
  outline: 'none',

  selectors: {
    '&::placeholder': {
      color: theme.color.dark200,
    },
  },
})
