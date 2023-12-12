import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 'fit-content',
  minHeight: '200px',
  order: 1,
  ...themeUtils.responsiveStyle({
    lg: {
      order: 0,
      minHeight: '100%',
    },
  }),
})

export const headerWrapper = style({
  display: 'grid',

  maxHeight: 'min-content',
  maxWidth: '1344px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '55fr 45fr',
      gridTemplateRows: 'auto',
    },
  }),
})

export const headerImageContainer = style({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
})

export const headerImage = style({
  height: '459px',
  width: '670px',
  order: 0,
  position: 'absolute',
  top: '-80px',
  right: '0',
  left: '60px',
  bottom: '0',
  maxWidth: 'unset',
  objectFit: 'contain',
  ...themeUtils.responsiveStyle({
    lg: {
      order: 1,
    },
  }),
})
