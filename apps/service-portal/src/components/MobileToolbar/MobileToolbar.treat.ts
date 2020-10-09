import { zIndex } from '@island.is/service-portal/constants'
import { style } from 'treat'

export const wrapper = style({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: zIndex.mobileToolbar,
})

export const icon = style({
  width: 31,
  height: 31,
})

export const burger = style({
  marginLeft: 'auto',
})

export const menuItem = style({
  whiteSpace: 'nowrap',
})
