import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const checkboxGrid = style({
  display: 'grid',
  gap: theme.spacing[2],
  gridTemplateColumns: 'minmax(0, 1fr)',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      // minmax(0, 1fr) instead of 1fr so tracks can shrink below their
      // content's min-width and wide labels can't stretch the columns
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

// Declared after checkboxGrid and overriding inside the same media query:
// a plain rule would lose to checkboxGrid's lg rule since vanilla-extract
// emits all @media rules after the base rules.
export const fullWidth = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
})

export const checkboxItem = style({})

// Grid cells stretch to the tallest item in their row, but the Checkbox
// box (container div) and its label don't fill their parent by default.
// Stretching them equalizes box heights within a row; the label's own
// align-items: center keeps the content vertically centered.
globalStyle(`${checkboxItem} > div, ${checkboxItem} label`, {
  height: '100%',
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
