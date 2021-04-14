import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const HEADER_HEIGHT_SM = 80
export const HEADER_HEIGHT_LG = 112

export const zIndex = {
  mobileMenu: 9,
  header: 10,
  notificationSidebar: 11,
  actionSidebar: 12,
  menu: 13,
  modal: 13,
}

export const header = style({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: zIndex.header,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: HEADER_HEIGHT_SM,
  backgroundColor: theme.color.white,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: HEADER_HEIGHT_LG,
    },
  },
})

export const placeholder = style({
  height: HEADER_HEIGHT_SM,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      height: HEADER_HEIGHT_LG,
    },
  },
})
