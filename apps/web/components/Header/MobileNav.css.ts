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
  padding: '0 24px 40px 24px',
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

// Search-only variant (no-nav pages: institution sites + project pages).
// Full-bleed bar anchored under the header that grows straight down instead
// of the right-anchored drilldown drawer. Matches Figma "Mobile_Search":
// 24px side gutters -> a 342-wide search box on a 390 viewport.
export const panelSearch = style({
  position: 'fixed',
  top: 80,
  left: 0,
  right: 0,
  width: '100%',
  background: theme.color.white,
  boxShadow: NAV_SHADOW,
  zIndex: NAV_OVERLAY_Z_INDEX,
  // 0fr -> 1fr animates the panel height to its (auto) content size, so it
  // literally grows from the top down. See panelSearchInner for the clip.
  display: 'grid',
  gridTemplateRows: '0fr',
  opacity: 0,
  visibility: 'hidden',
  padding: '0 24px',
  // Clip the upward shadow bleed over the header; the huge negative bottom
  // inset leaves the drop shadow AND the autosuggest dropdown free to
  // overflow downward.
  clipPath: 'inset(0px 0px -9999px 0px)',
  transition: `grid-template-rows ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear ${NAV_TRANSITION_DURATION}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const panelSearchOpen = style({
  gridTemplateRows: '1fr',
  opacity: 1,
  visibility: 'visible',
  transition: `grid-template-rows ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear 0ms`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

// Single grid child. overflow:hidden is what makes the 0fr row collapse the
// content during the grow/collapse animation.
export const panelSearchInner = style({
  minHeight: 0,
  overflow: 'hidden',
  paddingBottom: 24,
})

// Applied once the panel has finished opening: stop clipping so the
// absolutely-positioned autosuggest menu can overflow the hug-content panel.
export const panelSearchInnerOpen = style({
  overflow: 'visible',
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
  // Matches panelList.marginTop (48) so the drilldown title lands at the
  // exact same vertical position as the first section row in the
  // top-level view — no tiny shift when entering/exiting the drilldown.
  // Figma's two frames disagree here (top-level uses spacing/48, drilldown
  // uses spacing/40); we favour visual stability across views.
  marginTop: 48,
  // Figma spacing/32 between back-title and drilldown list.
  marginBottom: 32,
})

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Visible chevron is 16x16. 14px of padding all round pushes the hit
  // target to 44x44 (WCAG 2.1 SC 2.5.5 AAA, Apple HIG). box-sizing
  // content-box guarantees the arithmetic (16 + 14*2) holds against any
  // global reset that forces border-box. The matching negative margin
  // cancels the visual bleed so panelHeader's flex layout is identical
  // to the pre-expansion version — the icon stays in the same place,
  // the title doesn't shift right, but the tap target is four-fold.
  boxSizing: 'content-box',
  width: 16,
  height: 16,
  padding: 14,
  margin: -14,
  background: 'transparent',
  border: 'none',
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

// Figma "Heading/H4" — 20/30 SemiBold, dark400.
export const panelTitle = style({
  fontFamily: theme.typography.fontFamily,
  fontSize: 20,
  fontWeight: theme.typography.semiBold,
  lineHeight: '30px',
  color: theme.color.dark400,
  margin: 0,
})

// Top-level list — three section buttons (Þjónustuflokkar, Lífsviðburðir,
// Opinberir aðilar). Figma spacing/48 between items, and spacing/48 from
// the search bar above.
export const panelList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 48,
  marginTop: 48,
  marginBottom: 0,
  padding: 0,
  listStyle: 'none',
})

// Drilldown list — org / category / life-event links. Figma spacing/28
// between items. Top margin is 0 because panelHeader above already owns
// the 32px gap before this list.
export const drilldownList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

// Figma "Heading/H4" — 20/30 SemiBold, dark400. No hover color change:
// Figma's hover variant keeps the label in dark400 and signals
// interactivity via the chevron (blue) rather than a text colour shift.
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
  fontSize: 20,
  fontWeight: theme.typography.semiBold,
  lineHeight: '30px',
  cursor: 'pointer',
  textAlign: 'left',

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
// Mirrors DesktopNav's dropdownLinkLogo: fixed 20x20 with contain scaling,
// no shrinking when names wrap, and a 3px top nudge so the logo sits
// level with the first line's cap-height rather than the line-box leading.
export const drillLinkLogo = style({
  width: 20,
  height: 20,
  marginTop: 3,
  objectFit: 'contain',
  flexShrink: 0,
})

export const drillLink = style({
  // See note on DesktopNav.dropdownLink: block-level flex so rows with a
  // logo img don't gain a 1px descent from inline-flex line-box math.
  display: 'flex',
  // Shrink the anchor to content width so the hover underline tracks the
  // visible text rather than spanning the full panel. fit-content is
  // clamped to the panel width, so wrapped names still flow naturally.
  width: 'fit-content',
  // Top-align the logo next to the first line of text so wrapped org names
  // keep the logo beside line 1, mirroring the desktop dropdown.
  alignItems: 'flex-start',
  gap: 8,
  fontFamily: theme.typography.fontFamily,
  // Figma "Paragraph/Default" — 16/24 Light, blue600.
  fontSize: 16,
  fontWeight: theme.typography.light,
  lineHeight: '24px',
  color: theme.color.blue600,
  // Mirrors DesktopNav.dropdownLink — footer-style animated underline via
  // box-shadow so the line fades in along with the colour shift on hover,
  // instead of text-decoration's instant on/off. paddingBottom: 4 gives
  // the underline clearance from glyph descenders.
  paddingBottom: 4,
  textDecoration: 'none',
  boxShadow: 'none',
  transition: 'color .2s, box-shadow .2s',

  ':hover': {
    color: theme.color.blueberry600,
    boxShadow: `inset 0 -2px 0 0 currentColor`,
    textDecoration: 'none',
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
  // Figma panel padding-top is 24 in the drilldown view and 40 in the
  // top-level view; we use 24 for a consistent chrome feel and let the
  // next sibling (panelList in top-level, panelHeader in drilldown) own
  // the rest of the vertical rhythm.
  marginTop: 24,
  marginBottom: 0,
})

// "Skoða allar …" row lives inside the drilldown view, just below the
// list. Figma groups it into the same column as the list at spacing/28.
//
// The generous bottom buffer is deliberate: the panel is a fixed
// `height: calc(100vh - 80px)` scroll container, and this row is its last
// child. Absolutely-positioned UI can overlap the row's resting position —
// the search autosuggest Menu (position:absolute, max-height 455) and, on
// mobile, the browser's dynamic bottom toolbar covering the 100vh bottom
// edge. Without trailing space the row sits flush at the bottom and can be
// permanently occluded. The buffer adds scroll travel so the link can be
// scrolled up the page, clear of anything overlapping the bottom edge.
export const seeAllRow = style({
  marginTop: 28,
  paddingBottom: '50vh',
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
