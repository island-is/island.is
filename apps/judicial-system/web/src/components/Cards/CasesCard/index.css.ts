import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  transition: 'border-color .25s ease-in-out',

  selectors: {
    '&:hover': {
      borderColor: theme.color.blue400,
    },
  },
})
