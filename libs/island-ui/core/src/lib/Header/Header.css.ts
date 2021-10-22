import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

import { responsiveStyleMap } from '../../utils/responsiveStyleMap'

export const container = responsiveStyleMap({
  height: { xs: 80, md: 112 },
})

export const infoContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderLeftWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.color.dark100,
    },
  }),
})

export const infoDescription = style({
  fontWeight: 300,
  lineHeight: 1.5,
  fontSize: 14,

  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 18,
    },
  }),
})

export const userNameContainer = style({
  flex: 1,
  minWidth: 0,
})
