import { style } from '@vanilla-extract/css'

import { theme,themeUtils } from '@island.is/island-ui/theme'

export const externalCTA = style({
  ...themeUtils.responsiveStyle({
    xl: {
      width: 'calc(116.667% - 26px)',
      marginLeft: 'calc(-16.6667% + 26px)',
    },
  }),
})

export const externalLink = style({
  fontSize: 14,
})
