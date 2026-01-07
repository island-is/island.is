import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'

const top = SERVICE_PORTAL_HEADER_HEIGHT_LG
const sidebarWidth = {
  desktop: '318px',
  tablet: '230px',
}

export const sidebarWrapper = style({
  top: top + theme.spacing[3],
  maxWidth: sidebarWidth.tablet,
  minWidth: sidebarWidth.tablet,
  ...themeUtils.responsiveStyle({
    lg: {
      top: top + theme.spacing[9],
      minWidth: sidebarWidth.desktop,
      maxWidth: sidebarWidth.desktop,
    },
  }),
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
})

export const sidebarWrap = style({
  maxWidth: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: `calc(100% - ${sidebarWidth.tablet})`,
    },
    lg: {
      maxWidth: `calc(100% - ${sidebarWidth.desktop})`,
    },
  }),
})
