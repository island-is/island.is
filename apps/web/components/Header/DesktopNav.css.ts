import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

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

  ':hover': {
    color: theme.color.blue400,
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
  boxShadow: '0 4px 30px 0 rgba(0, 97, 255, 0.16)',
  // Clip the shadow that would otherwise bleed upward into the header. Top
  // inset is 0 so the dropdown box itself stays intact, while -40px on the
  // other three sides allows the shadow to render freely there.
  clipPath: 'inset(0 -40px -40px -40px)',
  padding: '24px 48px 40px 48px',
  zIndex: 10,

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
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.light,
  lineHeight: '28px',
  color: theme.color.blue600,
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
})

export const seeAllRow = style({
  marginTop: 24,
})
