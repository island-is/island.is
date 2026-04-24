import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import {
  NAV_OVERLAY_MASK_Z_INDEX,
  NAV_OVERLAY_Z_INDEX,
  NAV_SHADOW,
  NAV_TRANSITION_DURATION,
  NAV_TRANSITION_EASING,
} from './headerNavTokens'

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  position: 'relative',
  // Match header height so dropdown `top: 100%` lands at header bottom.
  height: 80,
  // Shift button content down so the visible text bottom aligns with the
  // logo's visible bottom (~52.9px from header top). Without this the text
  // sits a few pixels above the logo's baseline because the button's top
  // padding pushes the text lower inside its own box.
  paddingTop: 10,
})

export const tabButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 0',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid transparent',
  cursor: 'pointer',
  color: theme.color.dark400,
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: theme.typography.semiBold,
  lineHeight: '16px',
  position: 'relative',

  // Hover matches the active state's underline so the transition from
  // hover → open has no extra motion; text stays dark400 per Figma.
  ':hover': {
    borderBottomColor: theme.color.blue400,
  },
  // Matches island-ui `FocusableBox` — 3px mint400 ring offset 3px outside.
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: 3,
  },
})

export const tabButtonActive = style({
  borderBottomColor: theme.color.blue400,
})

export const chevron = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  transformOrigin: 'center center',
  transition: `transform ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const chevronOpen = style({
  transform: 'rotate(180deg)',
})

export const dropdown = style({
  position: 'absolute',
  top: '100%',
  // Shift left by the same amount as the internal left padding so that the
  // content (title, list, "Skoða allar ..." link) aligns with the first nav
  // item's left edge, while the panel extends slightly leftward for visual
  // breathing room — matching the Figma design.
  left: -48,
  width: 864,
  maxWidth: 'calc(100vw - 96px)',
  background: theme.color.white,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  boxShadow: NAV_SHADOW,
  // Dropdown is always mounted; the `.dropdownOpen` class toggles the fade.
  // Asymmetric visibility transition delays hiding until the fade-out
  // finishes, keeping the element interactive until it's invisible.
  opacity: 0,
  visibility: 'hidden',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear ${NAV_TRANSITION_DURATION}`,
  // Clip the shadow that would otherwise bleed upward into the header. Top
  // inset is 0 so the dropdown box itself stays intact, while -40px on the
  // other three sides allows the shadow to render freely there.
  clipPath: 'inset(0 -40px -40px -40px)',
  padding: '24px 48px 40px 48px',
  zIndex: NAV_OVERLAY_Z_INDEX,

  // Below 1100px the dropdown spans the full viewport width (DesktopNav
  // measures offsetParent and sets left/right/width inline). Only the
  // visual tweaks that go along with that live here.
  '@media': {
    'screen and (max-width: 1099px)': {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      // Panel now touches the viewport edges — clip shadow flush on the sides
      // so it doesn't render off-screen, keep vertical bleed for the drop
      // shadow below.
      clipPath: 'inset(0 0 -40px 0)',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const dropdownOpen = style({
  opacity: 1,
  visibility: 'visible',
  transition: `opacity ${NAV_TRANSITION_DURATION} ${NAV_TRANSITION_EASING}, visibility 0ms linear 0ms`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
})

export const dropdownTitle = style({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  fontWeight: theme.typography.semiBold,
  lineHeight: '16px',
  color: theme.color.dark400,
  marginBottom: 24,
})

export const dropdownList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  columnGap: 16,
  rowGap: 16,
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const dropdownLink = style({
  // Block-level flex (not inline-flex) so the <li> row height is driven
  // solely by this anchor's box. Inline-flex leaves baseline/descent room
  // for the img inside, making logo rows ~1px taller than text-only rows.
  display: 'flex',
  // Top-align the logo next to the first line of text — when an org name
  // wraps to two lines the logo stays beside line 1 instead of drifting
  // to the middle of the cell.
  alignItems: 'flex-start',
  gap: 8,
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.light,
  lineHeight: '28px',
  color: theme.color.blue600,
  // Match the site-wide <Link underline="normal"> treatment used in the
  // footer: the underline is a box-shadow rather than text-decoration so
  // it can animate in with the colour shift on hover. paddingBottom: 4
  // mirrors Link's 'normal' variant so the line sits clearly below the
  // baseline rather than overlapping descenders.
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

export const seeAllRow = style({
  marginTop: 24,
})

// Org logo shown next to a dropdown link for organizationPage items.
// `object-fit: contain` handles logos of varying aspect ratios within the
// fixed 20x20 box; `flex-shrink: 0` stops the flex row from squeezing it
// when long org names wrap. 3px marginTop nudges the icon down into the
// cap-height of the first text line so it reads as aligned with the
// glyphs rather than floating above the line-box leading (font-size 18
// with line-height 28 leaves ~5px of leading above the cap-top).
export const dropdownLinkLogo = style({
  width: 20,
  height: 20,
  marginTop: 3,
  objectFit: 'contain',
  flexShrink: 0,
})

// Sibling of the dropdown (not inside it — opacity cascades to descendants).
// Sits at the dropdown's top edge and covers the ~34px strip of header shadow
// that would otherwise bleed through the translucent dropdown mid-transition.
// Matches the dropdown's horizontal extent so it looks like part of the
// dropdown when visible. Controlled by React: visible only during the
// transition window, hidden at rest.
export const topMask = style({
  position: 'absolute',
  top: '100%',
  left: -48,
  width: 864,
  maxWidth: 'calc(100vw - 96px)',
  // Header box-shadow offset (4px) + blur (30px) ≈ 34px visible extent.
  height: 34,
  background: theme.color.white,
  pointerEvents: 'none',
  visibility: 'hidden',
  // Above the header's shadow, below the dropdown so the dropdown's content
  // still paints over the mask when fully open.
  zIndex: NAV_OVERLAY_MASK_Z_INDEX,
})

export const topMaskVisible = style({
  visibility: 'visible',
})
