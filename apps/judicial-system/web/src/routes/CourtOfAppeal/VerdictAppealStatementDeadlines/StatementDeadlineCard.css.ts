import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

// The party on the left, the date and its action on the right. The text
// column takes whatever the picker leaves, so the role line stays on one
// line; the picker column is sized for a date, not for half the card, which
// a flex row would have given it.
export const card = style({
  display: 'grid',
  rowGap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 320px)',
      columnGap: theme.spacing[3],
      rowGap: 0,
    },
  },
})
