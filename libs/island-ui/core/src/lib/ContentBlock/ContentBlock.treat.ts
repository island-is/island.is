import { style, styleMap } from 'treat'
import { theme, themeUtils } from '../../utils/theme'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'

export const root = style({ margin: '0 auto' })

export const width = styleMap(
  mapToStyleProperty(theme.contentWidth, 'maxWidth'),
)
