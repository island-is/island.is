import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  padding: `0 ${theme.spacing[1]}px`,
})

export const col = style({
  paddingBottom: theme.spacing[3],
})

export const innerCol = style({
  display: 'block',
  wordBreak: 'break-word',
})
