import { style } from 'treat'

import { themeUtils } from '../../utils/theme'

export const progressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})
