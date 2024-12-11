import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const markdownText = style({})

globalStyle(`${markdownText} ul`, {
  paddingTop: 16,
})

globalStyle(`${markdownText} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
})

globalStyle(`${markdownText} a:hover`, {
  color: theme.color.blueberry400,
})
