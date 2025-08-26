import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const reorderGroup = style({
  marginTop: theme.spacing[2],

  selectors: {
    '&:not(:has([data-reorder-item]))': {
      marginTop: 0,
    },
  },
})
