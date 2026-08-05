import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tabBar = style({
  display: 'inline-flex',
  background: theme.color.blue100,
})

export const alternativeTabDivider = style({
  height: '90%',
  margin: 'auto',
  inset: 0,
  width: '1px',
  background: theme.color.blue200,
})
