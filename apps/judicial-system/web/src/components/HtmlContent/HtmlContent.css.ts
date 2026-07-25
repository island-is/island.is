import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const root = style({
  fontWeight: theme.typography.light,
  whiteSpace: 'break-spaces',
})

globalStyle(`${root} p`, {
  margin: 0,
})

globalStyle(`${root} strong, ${root} b`, {
  fontWeight: theme.typography.semiBold,
})
