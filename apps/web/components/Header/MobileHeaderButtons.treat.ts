import { styleMap, style, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { borderRightWidth } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'

export const searchButton = style({
  borderRadius: `${theme.border.radius.large} 0 0 ${theme.border.radius.large}`,
  borderRightWidth: '0',
})

export const menuButton = style({
  borderRadius: `0 ${theme.border.radius.large}  ${theme.border.radius.large} 0`,
})
