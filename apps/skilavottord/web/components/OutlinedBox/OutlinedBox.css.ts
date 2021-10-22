import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.border.radius.large,
})
