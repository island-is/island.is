import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const logoContainer = style({
  display: 'flex',
  alignItems: 'center',
  width: 300,
})

export const logoText = style({
  fontWeight: theme.typography.semiBold,
  textTransform: 'uppercase',
})
