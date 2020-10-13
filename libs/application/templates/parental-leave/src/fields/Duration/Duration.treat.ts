import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const percentLabel = style({
  borderRightWidth: 1,
  borderRightStyle: 'solid',
  borderRightColor: theme.color.blue200,
  flex: 1,
})

export const percentNumber = style({
  width: '8ch',
})
