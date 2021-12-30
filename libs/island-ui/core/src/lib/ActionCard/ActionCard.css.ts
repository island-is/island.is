import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const progressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})

export const progressMeterWithDate = style({
  ...themeUtils.responsiveStyle({
    lg: {
      marginTop: -18,
    },
  }),
})

export const avatar = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
      width: 66,
      height: 66,
    },
  }),
})

export const button = style({
  ...themeUtils.responsiveStyle({
    sm: {
      alignSelf: 'flex-end',
    },
  }),
})
