import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const image = style({
  width: 60,
  height: 60,
  marginRight: theme.spacing[3],
})

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark100,
})

export const content = style({
  wordBreak: 'break-word',
})
