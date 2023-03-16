import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  display: 'flex',
  height: 72,
  width: '100%',
  ':hover': {
    textDecoration: 'none',
  },
  ...themeUtils.responsiveStyle({
    md: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 96,
      width: 96,
      float: 'right',
    },
  }),
})

export const image = style({
  maxHeight: 40,
})
export const tooltip = style({
  position: 'absolute',
  top: 1,
  right: 3,
})
