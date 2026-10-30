import { recipe } from '@vanilla-extract/recipes'

import { theme } from '@island.is/island-ui/theme'

export const stack = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    gap: {
      1: { gap: theme.spacing[1] },
      2: { gap: theme.spacing[2] },
      3: { gap: theme.spacing[3] },
      4: { gap: theme.spacing[4] },
      5: { gap: theme.spacing[5] },
      6: { gap: theme.spacing[6] },
      7: { gap: theme.spacing[7] },
      8: { gap: theme.spacing[8] },
      9: { gap: theme.spacing[9] },
      10: { gap: theme.spacing[10] },
      12: { gap: theme.spacing[12] },
      15: { gap: theme.spacing[15] },
      20: { gap: theme.spacing[20] },
    },
    marginTop: {
      1: { marginTop: theme.spacing[1] },
      2: { marginTop: theme.spacing[2] },
      3: { marginTop: theme.spacing[3] },
      4: { marginTop: theme.spacing[4] },
      5: { marginTop: theme.spacing[5] },
      6: { marginTop: theme.spacing[6] },
      7: { marginTop: theme.spacing[7] },
      8: { marginTop: theme.spacing[8] },
      9: { marginTop: theme.spacing[9] },
      10: { marginTop: theme.spacing[10] },
      12: { marginTop: theme.spacing[12] },
      15: { marginTop: theme.spacing[15] },
      20: { marginTop: theme.spacing[20] },
    },
  },
  defaultVariants: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[0],
  },
})

/**
 * Two equal columns that fill the row, falling back to one on narrow screens.
 *
 * What a pair of radio buttons needs to reach both edges of the box it sits
 * in: a flex row sizes each to its own label and leaves the right-hand side
 * short. The district court's advocate screen has carried its own copy of this
 * since before there was anywhere shared to put it.
 */
export const twoColumn = recipe({
  base: {
    display: 'grid',
    alignItems: 'flex-end',
    '@media': {
      [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
        gridTemplateColumns: '1fr 1fr',
      },
    },
  },
  variants: {
    gap: {
      1: { gap: theme.spacing[1] },
      2: { gap: theme.spacing[2] },
      3: { gap: theme.spacing[3] },
    },
  },
  defaultVariants: {
    gap: 2,
  },
})
