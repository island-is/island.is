import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import {
  NAV_SHADOW,
  NAV_TRANSITION_DURATION,
  NAV_TRANSITION_EASING,
} from './headerNavTokens'

export const header = style({
  background: theme.color.white,
  // Transition lives on the base class so the shadow fades in AND out
  // symmetrically as `.headerWithShadow` is toggled.
  transition: `box-shadow ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}`,
})

export const headerWithShadow = style({
  boxShadow: NAV_SHADOW,
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
