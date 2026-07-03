import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const checkboxGrid = style({
  display: 'grid',
  gap: theme.spacing[2],
  // minmax(0, 1fr) instead of 1fr so tracks can shrink below their
  // content's min-width and wide labels can't stretch the columns
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
})

export const fullWidth = style({
  gridTemplateColumns: 'minmax(0, 1fr)',
})

// The island-ui Checkbox label text is a flex: 1 child without
// min-width: 0, so it can't shrink below its longest word and
// overflows the box in narrow columns. min-width: 0 lets it shrink;
// overflow-wrap breaks a word only when it alone exceeds the
// available width.
globalStyle(`${checkboxGrid} label > span`, {
  minWidth: 0,
  overflowWrap: 'break-word',
})
