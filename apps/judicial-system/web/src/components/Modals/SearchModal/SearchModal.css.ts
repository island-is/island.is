import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const resultButton = style({
  width: '100%',
})

export const searchModal = style({
  minWidth: '634px',
  overflow: 'hidden',
})

export const searchResultsContainer = style({
  overflow: 'scroll',
})

export const searchResults = style({
  display: 'grid',
  gap: `${theme.spacing[2]}px`,
})
