import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const header = style({
  background: theme.color.white,
  transition: 'box-shadow 150ms ease',
})

export const headerWithShadow = style({
  boxShadow: '0 4px 30px 0 rgba(0, 97, 255, 0.16)',
})

export const headerRow = style({
  minHeight: 80,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
})

// The single direct child (Columns) is a flex item and would otherwise
// collapse to its content width. Force it to fill the row so the
// right-aligned controls reach the GridContainer edge.
globalStyle(`${headerRow} > *`, {
  flex: '1 1 auto',
  minWidth: 0,
  width: '100%',
})

// Compact (40px) utility buttons for the desktop header bar.
// Island-ui's utility variant forces minHeight: 48 at md+; override it here
// so the Mínar síður / language toggle buttons match the new design.
export const compactUtilityButtons = style({})

globalStyle(`${compactUtilityButtons} button`, {
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minHeight: 40,
    },
  },
})
