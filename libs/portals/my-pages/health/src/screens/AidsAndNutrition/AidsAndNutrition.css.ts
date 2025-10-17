import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const iconStyle = style({
  marginLeft: 7,
})

export const expiringStyle = style({
  color: theme.color.yellow300,
})

export const white = style({
  background: theme.color.white,
})

export const locationModal = style({
  maxHeight: '400px',
  overflow: 'scroll',
})
