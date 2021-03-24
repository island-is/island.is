import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/core'

export const menu = style({
  width: '100%',
  maxWidth: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      width: 311,
    },
  }),
})

export const avatar = style({
  width: 56,
  height: 56,
})

export const breakWord = style({
  wordBreak: 'break-word',
})
