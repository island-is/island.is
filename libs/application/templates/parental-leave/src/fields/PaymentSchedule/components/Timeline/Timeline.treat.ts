import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const panel = style({
  minWidth: '160px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minWidth: '200px',
    },
  },
})

const borderStyle = `1px solid ${theme.color.dark200}`

export const panelRow = style({
  borderTop: borderStyle,
  borderRight: borderStyle,
  height: '64px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  flexDirection: 'column',
  paddingRight: theme.spacing[2],
  selectors: {
    [`&:first-child`]: {
      borderTop: 'none',
      borderRight: 'none',
    },
    [`&:last-child`]: {
      borderBottom: borderStyle,
    },
  },
})

export const firstPanelRowSeparator = style({
  right: 0,
  bottom: 0,
  height: '14px',
  borderRight: borderStyle,
})

export const chartContainer = style({
  width: '75%',
  overflowX: 'scroll',
  overflowY: 'hidden',
})

export const chartMonth = style({
  whiteSpace: 'nowrap',
  position: 'relative',
})

export const row = style({
  borderTop: borderStyle,
  height: '64px',
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
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
  background: `repeating-linear-gradient(-45deg, #fff, #fff 5%, rgba(255, 255, 255, 0.35) 5%, rgba(255, 255, 255, 0.35) 50%, #fff 50%) top left fixed`,
  backgroundSize: '10px 10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '0 16px',
  height: '63px',
})

export const highlightDay = style({
  position: 'absolute',
  left: 0,
  top: '7px',
  borderLeft: `1px solid ${theme.color.blueberry300}`,
  height: '1000px',
  zIndex: 99,
})
