import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import {
  NAV_OVERLAY_MASK_Z_INDEX,
  NAV_OVERLAY_Z_INDEX,
  NAV_SHADOW,
  NAV_SHADOW_COLOR,
  NAV_TRANSITION_DURATION,
  NAV_TRANSITION_EASING,
} from './headerNavTokens'

// The panel is anchored to the right edge of the viewport, sitting immediately
// below the header. It is not full-screen — it leaves a visible strip of the
// page on the left (matches Figma node 16590:239300 which positions the panel
// at left: 85px, width: 305px on a 390-wide viewport).
export const panel = style({
  position: 'fixed',
  top: 80,
  right: 0,
  width: 305,
  maxWidth: 'calc(100vw - 24px)',
  height: 'calc(100vh - 80px)',
  overflowY: 'auto',
  // Prevents the rubber-band overscroll from shifting sticky children
  // (the top scroll-shadow) past the panel edges during pull-scroll.
  overscrollBehavior: 'none',
  background: theme.color.white,
  boxShadow: NAV_SHADOW,
  // Panel is always mounted; the `.panelOpen` class toggles the fade.
  // `visibility` uses a 0ms duration with a delay equal to the opacity
  // transition on close, so the panel only becomes non-interactive after
  // the fade-out finishes. On open, no delay so it's interactive
  // immediately.
  opacity: 0,
  visibility: 'hidden',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear ${NAV_TRANSITION_DURATION}`,
  clipPath: 'inset(0 -40px 0 -40px)',
  // No top padding so the sticky scroll-shadow anchors to the panel's
  // absolute top edge (sticky top:0 anchors to the padding-box, not the
  // border-box). The visual top gap lives on the first content element.
  padding: '0 24px 24px 24px',
  zIndex: NAV_OVERLAY_Z_INDEX,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const panelOpen = style({
  opacity: 1,
  visibility: 'visible',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear 0ms`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

// Sticky gradient overlay at the top of the panel that fades in when the
// panel is scrolled past ~10px. Uses a linear-gradient instead of a
// box-shadow because browsers render shadows on very thin elements
// inconsistently inside overflow scroll containers. The gradient
// approximates the same soft blue fade the header shadow produces.
// Negative horizontal margins extend the overlay across the panel's side
// padding; the negative bottom margin collapses its height so it doesn't
// push content down.
export const scrollShadow = style({
  position: 'sticky',
  top: 0,
  height: 16,
  marginLeft: -24,
  marginRight: -24,
  marginBottom: -16,
  zIndex: 1,
  background: `linear-gradient(to bottom, ${NAV_SHADOW_COLOR}, rgba(0, 97, 255, 0))`,
  opacity: 0,
  transition: 'opacity 200ms ease-out',
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const scrollShadowVisible = style({
  opacity: 1,
})

export const panelHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  minHeight: 24,
  marginBottom: 24,
})

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: theme.color.dark400,
  cursor: 'pointer',
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 3,
  },
})

export const panelTitle = style({
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.semiBold,
  lineHeight: '24px',
  color: theme.color.dark400,
  margin: 0,
})

export const panelList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const drillRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: 0,
  background: 'transparent',
  border: 'none',
  color: theme.color.dark400,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.semiBold,
  lineHeight: '24px',
  cursor: 'pointer',
  textAlign: 'left',

  ':hover': {
    color: theme.color.blue400,
  },
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 3,
  },
})

export const drillRowLabel = style({
  flex: '1 1 auto',
  minWidth: 0,
})

// Org logo shown next to a drilldown link for organizationPage items.
// Mirrors DesktopNav's dropdownLinkLogo: fixed 20x20 with contain scaling
// and no shrinking when names wrap.
export const drillLinkLogo = style({
  width: 20,
  height: 20,
  objectFit: 'contain',
  flexShrink: 0,
})

export const drillLink = style({
  // See note on DesktopNav.dropdownLink: block-level flex so rows with a
  // logo img don't gain a 1px descent from inline-flex line-box math.
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.light,
  lineHeight: '24px',
  color: theme.color.blue600,
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 3,
  },
})

export const searchWrapper = style({
  marginTop: 24,
  marginBottom: 24,
})

export const seeAllRow = style({
  marginTop: 24,
})

// Dormant — the JSX consumer is commented out in MobileNav.tsx. Kept here so
// we can re-enable the mask later (covers the ~34px of header shadow that
// would otherwise bleed through the translucent panel during open/close).
// It looked right on the frontpage but flashed over content sitting flush
// under the header on other pages, so we're shelving it for now.
export const topMask = style({
  position: 'fixed',
  top: 80,
  right: 0,
  width: 305,
  maxWidth: 'calc(100vw - 24px)',
  // Header box-shadow offset (4px) + blur (30px) ≈ 34px visible extent.
  height: 34,
  background: theme.color.white,
  pointerEvents: 'none',
  visibility: 'hidden',
  zIndex: NAV_OVERLAY_MASK_Z_INDEX,
})

export const topMaskVisible = style({
  visibility: 'visible',
})
