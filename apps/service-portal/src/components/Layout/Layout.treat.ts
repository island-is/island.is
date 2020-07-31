import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/service-portal/constants'

export const layoutWrapper = style({
  minHeight: `calc(100vh - ${SERVICE_PORTAL_HEADER_HEIGHT_LG}px)`,
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: theme.contentWidth.large,
})
