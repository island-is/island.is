import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const row = style({
  display: 'flex',
  alignItems: 'center',
  columnGap: theme.spacing[2],
  // Let the row shrink inside CSS grid parents (min-width: auto by default),
  // otherwise a long unbroken filename expands the whole court-record column.
  minWidth: 0,
  width: '100%',
})

export const documentCard = style({
  flex: '1 1 0%',
  minWidth: 0,
  overflow: 'hidden',
})

export const documentButton = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
})

export const documentName = style({
  flex: '1 1 0%',
  minWidth: 0,
  // Break long unbroken filenames inside the card instead of growing the page.
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
})

export const fileAction = style({
  flexShrink: 0,
  alignSelf: 'flex-start',
})
