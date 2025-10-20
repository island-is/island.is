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

const drawerTop = '50px' // Gap on top of filter modal
const sheetRadius = theme.border.radius.lg

export const sheet = style({
  left: 0,
  right: 0,
  bottom: 0,
  maxHeight: `calc(100vh - ${drawerTop})`, // this is fallback, use 100dvh if supported
  overflow: 'hidden',
  borderTopLeftRadius: sheetRadius,
  borderTopRightRadius: sheetRadius,
  // Enter animation from the bottom
  transform: 'translateY(100%)',
  transition: 'transform 300ms ease',
  willChange: 'transform', // Optimize for animation
  selectors: {
    '&[data-enter]': {
      transform: 'translateY(0)',
    },
  },
})

/** Small grabber area at the top to hint swiping */
export const grabber = style({
  padding: theme.spacing['2'],
})

export const grabberLine = style({
  display: 'block',
  width: 40,
  height: 4,
  borderRadius: 2,
  margin: '0 auto',
  backgroundColor: theme.color.dark200,
})

export const header = style({
  zIndex: 1,
  // subtle fade to indicate content under it can scroll
  '::after': {
    content: '',
    position: 'absolute',
    top: 57,
    left: 0,
    height: 16,
    width: '100%',

    background:
      'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3491771708683473) 86%, rgba(255,255,255,0) 100%)',
  },
})

/** The only scrollable area */
export const content = style({
  flex: 1,
  minHeight: 0, // important for flex children to allow overflow
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  padding: `0 ${theme.spacing['3']}`,
  paddingBottom: `calc(${theme.spacing['8']} + env(safe-area-inset-bottom))`,
})

/** Footer sticks to the bottom of the sheet and remains visible */
export const footer = style({
  position: 'sticky',
  bottom: 0,
  background: 'white',
  zIndex: 1,
  padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
  // safe area for iOS home indicator
  // paddingBottom: `calc(${theme.spacing['3']} + env(safe-area-inset-bottom))`, // NOT WORKING ?? CHECK
  '::before': {
    content: '""',
    position: 'absolute',
    bottom: 77,
    left: 0,
    height: 16,
    width: '100%',
    background:
      'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3491771708683473) 86%, rgba(255,255,255,0) 100%)',
  },
})

/** dvh override (modern browsers only) */
globalStyle(`@supports (height: 100dvh)`, {
  // Vanilla Extract doesn't support nested @supports in style(), so use globalStyle
  [`${sheet}`]: {
    maxHeight: 'calc(100dvh - 50px)',
  },
})
