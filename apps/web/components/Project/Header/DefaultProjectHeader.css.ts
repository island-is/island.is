import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const headerBg = style({
  height: 'fit-content',
  minHeight: '200px',
  order: 1,
  ...themeUtils.responsiveStyle({
    md: {
      order: 0,
      minHeight: '100%',
    },
  }),
})

export const headerWrapper = style({
  display: 'grid',
  minHeight: '300px',
  height: 'fit-content',
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'min-content',
    },
  }),
})

export const headerImage = style({
  height: '100%',
  maxHeight: '200px',
  width: '100%',
  objectFit: 'cover',
  order: 0,
  ...themeUtils.responsiveStyle({
    md: {
      order: 1,
      maxHeight: 'fit-content',
    },
  }),
})
