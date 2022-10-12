import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const chapterContainer = style({
  display: 'flex',
  border: `1px solid ${theme.color.blue400}`,
  borderRadius: theme.border.radius.large,
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  marginBottom: `${theme.spacing[2]}px`,
})
