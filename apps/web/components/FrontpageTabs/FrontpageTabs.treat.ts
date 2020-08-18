import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const tabBullet = style({
  width: 8,
  height: 8,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  marginRight: 16,
  transition: `all 300ms ease`,
})

export const tabBulletSelected = style({
  width: 32,
  backgroundColor: theme.color.red400,
})
