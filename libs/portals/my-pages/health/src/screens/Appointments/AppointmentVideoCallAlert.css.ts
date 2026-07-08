import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const videoCallMessageRow = style({
  display: 'grid',
  width: '100%',
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: 'minmax(0, 1fr)',
      rowGap: 8,
    },
    sm: {
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'center',
      columnGap: 8,
    },
  }),
})

export const videoCallLink = style({
  ...themeUtils.responsiveStyle({
    xs: {
      display: 'block',
      width: '100%',
    },
    sm: {
      display: 'inline-block',
      width: 'auto',
    },
  }),
})
