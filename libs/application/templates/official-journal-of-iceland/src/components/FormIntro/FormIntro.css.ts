import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const wrapper = style({
  maxWidth: 660,
  marginBottom: theme.spacing[6],
})

export const titleWrapper = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing[2],
})
