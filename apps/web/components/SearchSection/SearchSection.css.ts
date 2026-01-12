import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const mediaItem = style({
  display: 'inline-block',
  height: 'auto',
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      height: '100%',
      maxHeight: 500,
      objectFit: 'contain',
    },
  }),
})

export const minHeight = style({
  display: 'flex',
  position: 'relative',
  minHeight: 'initial',
  ...themeUtils.responsiveStyle({
    md: {
      minHeight: 500,
    },
  }),
})

export const defaultIllustration = style({
  position: 'relative',
  bottom: '-10%',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'initial',
      bottom: 0,
    },
  }),
})
