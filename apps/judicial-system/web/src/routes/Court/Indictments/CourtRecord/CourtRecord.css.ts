import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const reorderGroup = style({
  marginTop: theme.spacing[2],

  selectors: {
    '&:not(:has([data-reorder-item]))': {
      marginTop: 0,
    },
  },
})
