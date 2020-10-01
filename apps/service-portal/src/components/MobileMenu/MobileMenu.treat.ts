import {
  SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex,
} from '@island.is/service-portal/constants'
import { style } from 'treat'

export const wrapper = style({
  top: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  zIndex: zIndex.mobileMenu,
})
