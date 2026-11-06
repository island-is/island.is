import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const floatedImage = style({
  ...themeUtils.responsiveStyle({
    sm: {
      float: 'right',
      width: '50%',
      marginLeft: '16px',
    },
  }),
})

export const clearBoth = style({
  clear: 'both',
})

export const imageContainer = style({
  paddingTop: '69.18238994%',
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
})

export const image = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  objectFit: 'contain',
})
