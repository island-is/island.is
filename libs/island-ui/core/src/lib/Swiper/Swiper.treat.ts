import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({})

export const escapeGrid = style({
  marginLeft: -theme.grid.gutter.mobile * 2,
  marginRight: -theme.grid.gutter.mobile * 2,
})

export const container = style({
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  zIndex: 1,
})

export const slides = style({
  scrollSnapType: 'x proximity',
  overflow: 'auto',
  display: 'flex',
  transform: 'translate3d(0,0,0)',
})

export const slide = style({
  width: '100%',
  height: '100%',
  position: 'relative',
  display: 'flex',
  scrollSnapAlign: 'center',
  flexShrink: 0,
  selectors: {
    ['&:last-child::after']: {
      content: "''",
      display: 'block',
      flex: 'none',
      width: theme.spacing[4],
    },
  },
})
