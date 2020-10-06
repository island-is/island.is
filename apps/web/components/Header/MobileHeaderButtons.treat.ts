import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const searchButton = style({
  borderRadius: `${theme.border.radius.large} 0 0 ${theme.border.radius.large}`,
  borderRightWidth: '0',
})

export const menuButton = style({
  borderRadius: `0 ${theme.border.radius.large}  ${theme.border.radius.large} 0`,
})
