import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { mapToStyleProperty } from 'libs/island-ui/core/src/utils'

export const container = style({
  width: '100%',
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: theme.border.radius.large,
  borderColor: theme.color.blue200,
})

export const colors = styleMap(mapToStyleProperty(theme.color, 'backgroundColor'))
