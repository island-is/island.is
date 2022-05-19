import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const resendInfoPanelContainer = style({
  marginBottom: theme.spacing[5],
})

export const prosecutorContainer = style({
  paddingBottom: theme.spacing[6],
  marginBottom: theme.spacing[5],
  borderBottom: `2px solid ${theme.color.purple100}`,
})
