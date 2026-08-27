import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

// Wrapper around each member pill: the positioning context for the overlay
// below, and the only handle for its hover/focus state — Tag renders its own
// button and exposes no class of its own.
export const memberPill = style({
  display: 'inline-flex',
  position: 'relative',
  borderRadius: theme.border.radius.large,
  // The overlay would mask Tag's mint focus ground, so the keyboard indicator
  // lives out here where nothing covers it. Transient under the pointer: the
  // click that focuses the pill also removes it.
  ':focus-within': {
    boxShadow: `0 0 0 3px ${theme.color.mint400}`,
  },
})

// Tag's `focusable` class floods the ground blue400 with white text on hover.
// That 150ms background transition running underneath a white overlay fading in
// on top of it is what reads as a flash, so the pill is pinned to its resting
// look and the overlay becomes the only thing that changes.
//
// globalStyle because the target is Tag's own button, a descendant we don't
// render — `& button:hover` is not a selector vanilla-extract accepts on a
// style block. Specificity is 0,2,1 against Tag's own 0,2,0, so this wins.
globalStyle(`${memberPill} button:hover`, {
  backgroundColor: 'transparent',
  color: theme.color.blue400,
})

// The remove affordance is taken out of flow entirely and fades in over the
// pill, so the pill's box never changes — no reserved slot, no reflow, and the
// same width hovered or not. `pointerEvents: none` lets the click reach the
// button underneath. Matches Tag's blue `outlined` look so what appears reads
// as the same pill with an × in it.
//
// No `(hover: none)` fallback on purpose: showing this permanently on touch
// would hide the ordinal it covers. The pill stays tappable regardless.
export const removeOverlay = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.border.radius.large,
  border: `1px solid ${theme.color.blue200}`,
  backgroundColor: theme.color.white,
  color: theme.color.blue400,
  opacity: 0,
  transition: 'opacity 150ms ease',
  pointerEvents: 'none',
  selectors: {
    [`${memberPill}:hover &`]: {
      opacity: 1,
    },
    [`${memberPill}:focus-within &`]: {
      opacity: 1,
    },
  },
})
