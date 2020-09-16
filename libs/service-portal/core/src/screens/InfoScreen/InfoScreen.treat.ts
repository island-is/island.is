import { themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const externalCTA = style({
  ...themeUtils.responsiveStyle({
    xl: {
      width: 'calc(116.667% - 26px)',
      marginLeft: 'calc(-16.6667% + 26px)',
    },
  }),
})
