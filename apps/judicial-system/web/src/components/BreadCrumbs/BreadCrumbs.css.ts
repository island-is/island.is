import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const link = style({
  selectors: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
})

export const linkText = style({
  borderRadius: theme.border.radius.standard,
  color: theme.color.purple400,
  transition: 'background-color 0.2s ease, color 0.2s ease',
  padding: `2px 4px`,

  selectors: {
    '&:hover': {
      backgroundColor: theme.color.purple300,
    },
  },
})
