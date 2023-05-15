import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const footer = style({
  paddingTop: theme.spacing[8],
})

export const footerColor = style({
  backgroundColor: theme.color.blue100,
  margin: 0,
  width: '100%',
})
