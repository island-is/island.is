import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const headerBg = style({
  height: 'fit-content',
  minHeight: '300px',
  order: 1,
  ...themeUtils.responsiveStyle({
    md: {
      order: 0,
      height: '400px',
    },
  }),
})

export const headerWrapper = style({
  display: 'grid',
  gridTemplateRows: '2fr 3fr',
  height: '500px',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'grid',
      height: '400px',
      gridTemplateColumns: '1fr 1fr',
    },
  }),
})

export const headerImage = style({
  height: '100%',
  maxHeight: '200px',
  objectFit: 'cover',
  width: '100%',
  order: 0,
  ...themeUtils.responsiveStyle({
    md: {
      order: 1,
      height: '400px',
      maxHeight: '100%',
      objectFit: 'cover',
    },
  }),
})
