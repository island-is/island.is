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

export const drawer = style({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  transition: 'transform 400ms ease-in-out',
  transform: 'translateY(100%)',
  selectors: {
    '&[data-enter]': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  opacity: 0.9,
})

export const drawerLine = style({
  width: 40,
  height: 4,
  borderRadius: 2,
  margin: '0 auto',
})

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['2'],
  right: theme.spacing['2'],
  zIndex: 2,
})

export const showResultsButton = style({
  '::before': {
    content: '',
    position: 'absolute',
    bottom: 77,
    left: 0,
    height: 16,
    width: '100%',
    background:
      'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3491771708683473) 86%, rgba(255,255,255,0) 100%)',
  },
})

export const topBar = style({
  '::after': {
    content: '',
    position: 'absolute',
    top: 57,
    left: 0,
    height: 16,
    width: '100%',
    zIndex: 1,
    background:
      'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3491771708683473) 86%, rgba(255,255,255,0) 100%)',
  },
})

export const mobilePopoverContainer = style({
  zIndex: 100,
  width: '100%',
})

export const mobileDrawerContainer = style({
  borderRadius: 16,
})

export const mobileInnerContainer = style({
  maxHeight: `calc(100vh - 96px)`,
})

export const overflow = style({
  overflowY: 'scroll',
  WebkitOverflowScrolling: 'auto',
  maxHeight: `calc(100vh - 235px)`,
})
