import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const root = style({
  // Escape grid
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
  position: 'relative',
  display: 'flex',
  scrollSnapAlign: 'center',
  flexShrink: 0,
  // Space between each slide
  marginLeft: theme.spacing[3],
  // Breathing space for box-shadow etc
  marginTop: theme.spacing[2],
  marginBottom: theme.spacing[2],
  selectors: {
    // First and last slides fake the horizontal grid margin
    ['&:last-child::after']: {
      content: "''",
      display: 'block',
      flex: 'none',
      width: theme.spacing[4],
    },
  },
})
