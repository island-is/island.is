import { themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

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
