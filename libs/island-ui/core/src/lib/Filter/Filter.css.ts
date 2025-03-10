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

export const mobileDrawerContainer = style({
  borderRadius: 16,
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

export const mobilePopoverContainer = style({
  zIndex: 100,
  width: '100%',
  overflowY: 'scroll',
})

export const mobileInnerContainer = style({
  maxHeight: `calc(100vh - ${theme.headerHeight.large}px)`,
})
