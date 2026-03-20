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
  minWidth: '90vw',
  maxWidth: '634px',
  overflow: 'hidden',
  margin: `${theme.spacing[3]}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      minWidth: '634px',
    },
  },
})

export const searchResultsContainer = style({
  overflow: 'scroll',
})

export const focus = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})
