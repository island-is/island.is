import { style, globalStyle } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const imageContainerHidden = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
    },
  }),
})

export const image = style({
  width: 60,
  height: 60,
})

export const icon = style({
  minWidth: 24,
  width: 32,
  height: 32,
})

globalStyle(`${icon} svg`, {
  height: '100%',
})
