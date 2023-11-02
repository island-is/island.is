import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const statisticBox = style({
  backgroundColor: 'white',
  border: '2px solid ' + theme.color.blue200,
  borderRadius: theme.spacing[1],
  padding: theme.spacing[3],
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
})
