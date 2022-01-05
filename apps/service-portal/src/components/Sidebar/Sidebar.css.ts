import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const sidebar = style({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  height: '100%',
  marginBottom: theme.spacing['10'],
  borderRight: `1px solid ${theme.color.blue200}`,
  background: theme.color.white,
  transition: 'all 250ms ease-in-out',
  width: 252,
})
export const collapsed = style({
  width: 138,
})

export const logoCollapsed = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginRight: -theme.spacing[3],
})

export const subnav = style({
  paddingLeft: theme.spacing[3],
  marginLeft: theme.spacing[8],
  borderLeft: `1px solid ${theme.color.blue200}`,
  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.spacing[3],
      marginLeft: theme.spacing[5],
    },
  }),
})

export const subnavCollapsed = style({
  padding: 0,
  marginLeft: 0,
  borderLeft: 'none',
})

export const navIcon = style({
  position: 'absolute',
  right: -theme.spacing[4],
  top: theme.spacing[10],
  ':hover': {
    cursor: 'pointer',
  },
})
