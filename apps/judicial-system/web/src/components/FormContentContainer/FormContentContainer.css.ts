import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const footerContainer = style({
  marginTop: theme.spacing[10],
  borderTop: `${theme.border.width.large}px solid ${theme.color.purple100}`,
  paddingTop: theme.spacing[5],
})
