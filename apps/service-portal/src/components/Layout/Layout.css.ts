import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  SERVICE_PORTAL_HEADER_HEIGHT_LG,
  SERVICE_PORTAL_SIDEBAR_WIDTH,
  SERVICE_PORTAL_SIDEBAR_WIDTH_COLLAPSED,
} from '@island.is/service-portal/constants'

export const layoutWrapper = style({
  minHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px)`,
  maxWidth: theme.contentWidth.large,
  marginLeft: 'unset',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: `calc(100vw - ${SERVICE_PORTAL_SIDEBAR_WIDTH}px)`,
      marginLeft: SERVICE_PORTAL_SIDEBAR_WIDTH,
    },
  }),
})

export const layoutWrapperWide = style({
  maxWidth: theme.contentWidth.large,
  marginLeft: 'unset',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: `calc(100vw - ${SERVICE_PORTAL_SIDEBAR_WIDTH_COLLAPSED}px)`,
      marginLeft: SERVICE_PORTAL_SIDEBAR_WIDTH_COLLAPSED,
    },
  }),
})

export const layoutContainer = style({
  paddingLeft: theme.grid.gutter.mobile * 2,
  paddingRight: theme.grid.gutter.mobile * 2,
  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.grid.gutter.desktop * 2,
      paddingRight: theme.grid.gutter.desktop * 2,
    },
  }),
})

export const layoutGrid = style({
  transition: 'margin 150ms ease-in-out, flex-basis 150ms ease-in-out',
  willChange: 'margin, flex-basis',
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: theme.contentWidth.large,
})
