import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import {
  NAV_OVERLAY_Z_INDEX,
  NAV_TRANSITION_DURATION,
  NAV_TRANSITION_EASING,
} from './headerNavTokens'

// Explicit size so the root matches the icon button's footprint in the
// header flex layout — the absolute-positioned input overlay does not
// contribute to layout, so without this the root would collapse when the
// overlay is open.
export const root = style({
  position: 'relative',
  display: 'inline-flex',
  width: 50,
  height: 48,
})

// Compact 50x48 magnifying-glass button sized to match the expanded
// SearchInput (island-ui's smallest AsyncSearch size is "medium" = 48px,
// so we match that instead of Figma's 40px to keep the icon→input
// expansion feeling seamless). Blue-100 fill distinguishes it from the
// white Mínar síður / EN buttons next to it.
export const iconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 50,
  height: 48,
  padding: '12px 16px',
  background: theme.color.blue100,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  color: theme.color.blue400,
  cursor: 'pointer',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}`,

  ':hover': {
    borderColor: theme.color.blue300,
  },
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 3,
  },

  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

// Fades the icon button out while the overlay is open so its border/fill
// don't bleed through the SearchInput's internal padding and visually
// "mangle" the input's right-edge icon area. Uses opacity (not visibility)
// so Escape's focus-restore still lands on the button.
export const iconButtonHidden = style({
  opacity: 0,
  pointerEvents: 'none',
})

// Absolute-positioned overlay pinned to the icon button's right edge. When
// open, it extends ~260px leftward — matching the width of the pre-redesign
// inline search input — so it covers the desktop nav triggers (or whatever
// else sits to the left of the search button) without being wider than it
// needs to be.
//
// The `::before` adds a transparent→white gradient immediately to the left
// of the input so nav text behind it fades out smoothly instead of being
// sliced by a hard edge.
export const inputOverlay = style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: 260,
  maxWidth: 'calc(100vw - 48px)',
  opacity: 0,
  visibility: 'hidden',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear ${NAV_TRANSITION_DURATION}`,
  zIndex: NAV_OVERLAY_Z_INDEX,
  '::before': {
    content: '""',
    position: 'absolute',
    right: '100%',
    top: 0,
    bottom: 0,
    width: 40,
    background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${theme.color.white} 50%)`,
    pointerEvents: 'none',
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const inputOverlayOpen = style({
  opacity: 1,
  visibility: 'visible',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear 0ms`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})
