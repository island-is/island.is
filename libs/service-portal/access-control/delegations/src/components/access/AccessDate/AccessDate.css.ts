import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const dateContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  columnGap: theme.spacing[1] / 2,
  whiteSpace: 'pre',
})
