import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const borderStyle = `1px solid ${theme.color.dark200}`

// ********************************************
// Chart Styles
// ********************************************

export const chartContainer = style({
  width: '75%',
  overflowX: 'scroll',
  overflowY: 'hidden',
})

export const chartMonth = style({
  position: 'relative',
  whiteSpace: 'nowrap',
})

export const row = style({
  alignItems: 'flex-start',
  borderTop: borderStyle,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '64px',
  position: 'relative',
  selectors: {
    [`&:first-child`]: {
      borderTop: 'none',
    },
    [`&:last-child`]: {
      borderBottom: borderStyle,
      overflow: 'hidden',
    },
  },
})

export const duration = style({
  display: 'grid',
})

export const period = style({
  background: `repeating-linear-gradient(-45deg, #fff, #fff 5%, rgba(255, 255, 255, 0.35) 5%, rgba(255, 255, 255, 0.35) 50%, #fff 50%) top left`,
  backgroundSize: '10px 10px',
  display: 'flex',
  flexDirection: 'column',
  height: '63px',
  justifyContent: 'center',
  padding: '0 16px',
})

export const highlightDay = style({
  borderLeft: `1px solid ${theme.color.blueberry300}`,
  height: '1000px',
  left: 0,
  position: 'absolute',
  top: '7px',
  zIndex: 99,
})

export const scrollGradient = style({
  background:
    'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
  bottom: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  width: '60px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      width: '100px',
    },
  },
})
