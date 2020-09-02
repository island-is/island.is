import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { mapToStyleProperty } from 'libs/island-ui/core/src/utils'

export const container = style({
  width: '100%',
  borderStyle: 'solid',
  
  borderBottomWidth: 1,
  borderColor: theme.color.blue200,
})

export const backgroundColors = styleMap(
  mapToStyleProperty(theme.color, 'backgroundColor'),
)
export const borderColors = styleMap(
  mapToStyleProperty(theme.color, 'borderColor'),
)
