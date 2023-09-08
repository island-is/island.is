import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const roleColumn = style({
  flex: 1,

  selectors: {
    '&:nth-child(2)': {
      margin: `0 ${theme.spacing[2]}px`,
    },
  },
})

export const userFormContainer = style({
  padding: '80px 0 48px 0',
  background: theme.color.white,
})
