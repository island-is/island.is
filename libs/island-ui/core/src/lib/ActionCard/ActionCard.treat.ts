import { themeUtils } from '../../utils/theme'
import { style } from 'treat'

export const progressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})
