import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const dialogDisclosure = style({
  width: '100%',
})

export const dialogContainer = style({
  zIndex: 10000,
  overflowY: 'scroll',
})

export const popoverContainer = style({
  zIndex: 100,
  maxWidth: 360,
  width: '100%',
  overflowY: 'auto',
})

export const filterCountButton = style({})
export const filterCount = style({
  outlineWidth: 8,
  outlineColor: theme.color.blue400,
  outlineOffset: 2,
  borderRadius: theme.border.radius.full,
  position: 'absolute',
  right: 12,
  height: 24,
  width: 24,
})

export const filterCountNumber = style({
  color: 'white',
  fontSize: 12,
  lineHeight: '24px',
})

globalStyle(`${filterCountButton} > span`, {
  position: 'relative',
  paddingRight: 42,
})

/* Mobile drawer */

export const modal = style({
  backgroundColor: 'rgba(0, 0, 60, 0.3)',
})

export const mobilePopoverContainer = style({
  zIndex: 100,
  width: '100%',
})

const drawerTop = '100px' // Gap on top of filter modal

/* Backdrop blocks background scroll & dims page */
export const backdrop = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,60,0.35)',
  zIndex: theme.zIndex.modal - 1,
})

/* Sheet container */
export const sheet = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'white',
  borderTopLeftRadius: theme.border.radius.lg,
  borderTopRightRadius: theme.border.radius.lg,
  zIndex: theme.zIndex.modal,

  // Fallback for browsers without dvh
  maxHeight: `calc(100vh - ${drawerTop})`,

  transform: 'translateY(100%)',
  opacity: 0,
  transition: 'transform 240ms ease, opacity 180ms ease',
  selectors: {
    '&[data-enter]': { transform: 'translateY(0)', opacity: 1 },
    '&[data-leave]': { transform: 'translateY(100%)', opacity: 0 },
  },
})

/* Grabber */
export const grabber = style({ padding: theme.spacing['2'] })
export const grabberLine = style({
  display: 'block',
  width: 40,
  height: 4,
  borderRadius: 2,
  margin: '0 auto',
  backgroundColor: theme.color.dark200,
})

/* Sticky header with subtle fade */
export const header = style({
  position: 'sticky',
  top: 0,
  background: 'white',
  zIndex: 1,
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 12,
      background:
        'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
    },
  },
})

/* Only this area scrolls */
export const content = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  padding: `0 ${theme.spacing['3']}`,
  paddingBottom: theme.spacing['8'],
})

/* Sticky footer with safe-area padding */
export const footer = style({
  position: 'sticky',
  bottom: 0,
  background: 'white',
  zIndex: 1,
  boxShadow: '0 -8px 16px rgba(0,0,0,0.06)',
  paddingBottom: theme.spacing['3'],
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      top: -12,
      height: 12,
      background:
        'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
    },
  },
})

/* Safe area support for footer */
globalStyle(`@supports (padding-bottom: env(safe-area-inset-bottom))`, {
  [footer]: {
    paddingBottom: `calc(${theme.spacing['3']} + env(safe-area-inset-bottom))`,
  },
  [content]: {
    paddingBottom: `calc(${theme.spacing['8']} + env(safe-area-inset-bottom))`,
  },
})

/* Small dvh upgrade when supported */
globalStyle(`@supports (height: 100dvh)`, {
  [sheet]: { maxHeight: `calc(100dvh - ${drawerTop})` },
})
