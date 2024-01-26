import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const link = style({
  display: 'flex',
  minHeight: 72,
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
  maxWidth: 60,
  maxHeight: 40,
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'initial',
    },
  }),
})

export const fixedImage = style({
  width: 96,
  aspectRatio: '1/1',
})

export const tooltip = style({
  position: 'absolute',
  top: 1,
  right: 3,
})
