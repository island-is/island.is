import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const headerButtons = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

export const iconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: '12px 16px',
  background: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  color: theme.color.dark400,
  cursor: 'pointer',

  ':hover': {
    borderColor: theme.color.blue300,
  },
})

export const valmyndButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  height: 40,
  padding: '12px 16px',
  background: theme.color.white,
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  color: theme.color.dark400,
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  fontWeight: theme.typography.semiBold,
  lineHeight: '16px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',

  ':hover': {
    borderColor: theme.color.blue300,
  },
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
  boxShadow: '0 4px 30px 0 rgba(0, 97, 255, 0.16)',
  clipPath: 'inset(0 -40px 0 -40px)',
  // No top padding so the sticky scroll-shadow anchors to the panel's
  // absolute top edge (sticky top:0 anchors to the padding-box, not the
  // border-box). The visual top gap lives on the first content element.
  padding: '0 24px 24px 24px',
  zIndex: 20,
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
  background:
    'linear-gradient(to bottom, rgba(0, 97, 255, 0.16), rgba(0, 97, 255, 0))',
  opacity: 0,
  transition: 'opacity 200ms ease-out',
  pointerEvents: 'none',
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
})

export const drillRowLabel = style({
  flex: '1 1 auto',
  minWidth: 0,
})

export const drillLink = style({
  display: 'block',
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: theme.typography.light,
  lineHeight: '24px',
  color: theme.color.blue600,
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
})

export const searchWrapper = style({
  marginTop: 24,
  marginBottom: 24,
})

export const seeAllRow = style({
  marginTop: 24,
})
