import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_SIDEBAR_WIDTH,
  SERVICE_PORTAL_SIDEBAR_WIDTH_COLLAPSED,
} from '@island.is/service-portal/constants'

export const sidebar = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,
  height: '100%',
  marginBottom: theme.spacing['10'],
  borderRight: `1px solid ${theme.color.blue200}`,
  background: theme.color.white,
  transition: 'all 250ms ease-in-out',
  width: SERVICE_PORTAL_SIDEBAR_WIDTH,
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  paddingBottom: theme.spacing['3'],
})
export const collapsed = style({
  width: SERVICE_PORTAL_SIDEBAR_WIDTH_COLLAPSED,
})

export const logoCollapsed = style({
  display: 'flex',
  justifyContent: 'center',
})

export const subnav = style({
  paddingLeft: theme.spacing[3],
  marginLeft: theme.spacing[7],
  borderLeft: `1px solid ${theme.color.blue200}`,
  ...themeUtils.responsiveStyle({
    md: {
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
  top: 43,
  ':hover': {
    cursor: 'pointer',
  },
})

export const itemWrapper = style({})

globalStyle(`${itemWrapper}:hover #sub-nav-model`, {
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 28,
  width: 220,
  height: 'max-content',
  zIndex: 10,
})
