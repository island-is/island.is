import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const buttonContainer = style({
  width: '288px',
})

export const link = style({
  color: theme.color.blue400,
  textDecoration: 'underline',
})
