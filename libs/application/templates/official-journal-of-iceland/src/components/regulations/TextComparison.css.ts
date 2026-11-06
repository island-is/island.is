import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { regulationContentStyling } from '@island.is/regulations/styling'

export const panel = style({
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
})

export const text = style({})
regulationContentStyling(text)
