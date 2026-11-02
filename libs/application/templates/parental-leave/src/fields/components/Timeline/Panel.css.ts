import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

const borderStyle = `1px solid ${theme.color.dark200}`

export const panel = style({
  minWidth: '130px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      minWidth: '200px',
    },
  },
})

export const firstPanelRowSeparator = style({
  borderRight: borderStyle,
  bottom: 0,
  height: '14px',
  position: 'absolute',
  right: 0,
})

export const panelRow = style({
  alignItems: 'flex-start',
  borderRight: borderStyle,
  borderTop: borderStyle,
  display: 'flex',
  flexDirection: 'column',
  height: '64px',
  justifyContent: 'center',
  paddingRight: theme.spacing[2],
  position: 'relative',
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

const iconSize = 24
export const deleteIcon = style({
  cursor: 'pointer',
  left: `${-(iconSize + theme.spacing[1] / 2)}px`,
  position: 'absolute',
  top: `calc(50% - ${iconSize / 2}px)`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      left: `${-(iconSize + theme.spacing[2])}px`,
    },
  },
})
