import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrap = style({})
export const label = style({})

export const required = style({
  color: theme.color.red600,
})

export const errorWrap = style({
  border: `1px solid ${theme.color.red600}`,
})
