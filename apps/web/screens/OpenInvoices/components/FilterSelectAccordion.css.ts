import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({})

globalStyle(`${wrapper} .island-select__menu`, {
  zIndex: theme.zIndex.modal,
})
