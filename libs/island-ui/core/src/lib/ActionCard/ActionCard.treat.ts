import { themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const progressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})
