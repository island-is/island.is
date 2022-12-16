import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const logoText = style({
  fontWeight: theme.typography.semiBold,
  textTransform: 'uppercase',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
})
