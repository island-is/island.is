import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const sidebar = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  height: '100%',
  marginBottom: theme.spacing['10'],
  transition: 'all 250ms ease-in-out',
  width: 252,
  backgroundColor: theme.color.blue100,
})

export const collapsed = style({
  width: 138,
})

export const logoCollapsed = style({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: 0,
  marginRight: -22,
})
export const subnav = style({
  paddingLeft: 26,
  borderLeft: `1px solid ${theme.color.blue200}`,
})

export const subnavCollapsed = style({
  padding: 0,
  borderLeft: 'none',
})

export const navIcon = style({
  position: 'absolute',
  right: '-28px',
  top: '88px',
  ':hover': {
    cursor: 'pointer',
  },
})
