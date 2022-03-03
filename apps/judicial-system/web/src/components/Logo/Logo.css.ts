import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const logoContainer = style({
  display: 'flex',
  alignItems: 'center',
  width: 300,
})

export const logoText = style({
  fontWeight: theme.typography.semiBold,
  textTransform: 'uppercase',
})
