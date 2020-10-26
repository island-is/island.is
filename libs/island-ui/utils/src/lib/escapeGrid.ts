import { theme } from '@island.is/island-ui/theme'

export const escapeGrid = (gutter: number = theme.grid.gutter.mobile) => ({
  marginLeft: -gutter * 2,
  marginRight: -gutter * 2,
})
