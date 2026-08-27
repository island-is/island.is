import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const resultButton = style({
  width: '100%',
  borderRadius: theme.border.radius.large,

  selectors: {
    '&:hover': {
      background: theme.color.blue100,
    },
  },
})

export const searchModal = style({
  width: '634px',
  maxWidth: `calc(90vw - ${theme.spacing[3] * 2}px)`,
  overflow: 'hidden',
  margin: `${theme.spacing[3]}px`,
})

export const searchResultsContainer = style({
  overflow: 'scroll',
})

export const focus = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})
