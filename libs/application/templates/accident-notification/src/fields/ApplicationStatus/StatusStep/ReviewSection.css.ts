import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const boldFileNames = style({
  fontWeight: 'bold',
})

export const flexNone = style({
  flex: 'none',
})

export const bottomBorderRadius = style({
  borderRadius: `0 0 ${theme.border.radius.default} ${theme.border.radius.default}`,
})
