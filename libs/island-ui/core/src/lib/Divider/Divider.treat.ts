import { style, styleMap } from 'treat'
import { theme } from '../../theme/index'

export const base = style({
  height: theme.border.width.standard,
})

export const weight = styleMap({
  regular: { background: theme.border.color.standard },
  strong: { background: theme.border.color.focus },
})
