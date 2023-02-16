import { themeUtils, theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const statisticBox = style({
  backgroundColor: 'white',
  border: '2px solid ' + theme.color.blue200,
  borderRadius: theme.spacing[1],
  padding: theme.spacing[3],
})
