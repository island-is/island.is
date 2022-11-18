import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'
const top = SERVICE_PORTAL_HEADER_HEIGHT_LG

export const sidebarWrapper = style({
  top,
  maxWidth: '230px',
  minWidth: '230px',
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: '318px',
      maxWidth: '318px',
    },
  }),
})

export const sticky = style({
  position: 'sticky',
  alignSelf: 'flex-start',
})
