import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const logoText = style({
  fontWeight: theme.typography.semiBold,
  textTransform: 'uppercase',
})

export const logoContainer = style({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
})
