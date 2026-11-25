import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const dropdown = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  maxHeight: 400,
  maxWidth: 629,
  overflowY: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.color.white,
  boxShadow: theme.shadows.strong,
  borderRadius: theme.border.radius.large,
})

export const scrollableContent = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  // Keep the scrollbar visible where browsers allow styling it, instead of
  // only showing it while scrolling
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.color.blue200} transparent`,
  selectors: {
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.color.blue200,
      borderRadius: 3,
    },
  },
})

export const scrollFade = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 64,
  borderBottomLeftRadius: theme.border.radius.large,
  borderBottomRightRadius: theme.border.radius.large,
  background: `linear-gradient(to bottom, rgba(255, 255, 255, 0), ${theme.color.white})`,
  pointerEvents: 'none',
})

export const option = style({
  paddingTop: '12px',
  paddingBottom: '12px',
})
