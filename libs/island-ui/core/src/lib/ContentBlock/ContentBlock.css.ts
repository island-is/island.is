import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import { mapToStyleProperty } from '../../utils/mapToStyleProperty'

export const root = style({ margin: '0 auto' })

export const width = styleVariants(
  mapToStyleProperty(theme.contentWidth, 'maxWidth'),
)
