import { style, styleMap } from 'treat'
import { theme } from '../../theme/index'
import { mapToStyleProperty } from '../../utils'

export const root = style({ margin: '0 auto' })

export const width = styleMap(
  mapToStyleProperty(theme.contentWidth, 'maxWidth'),
)
