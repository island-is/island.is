import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const banner = style({
  width: '100%',
  height: 32,
  // minHeight: 32,
  // flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.color.blue400,
})
