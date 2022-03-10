import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const menu = style({
  maxWidth: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      width: 353,
    },
  }),
})

export const messages = style({
  maxHeight: `calc(100vh - 250px)`,
  overflowY: 'auto',
})
