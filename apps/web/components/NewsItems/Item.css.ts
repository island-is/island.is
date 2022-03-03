import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  ...themeUtils.responsiveStyle({
    xl: {
      flexDirection: 'row',
    },
  }),
})

export const content = style({
  display: 'flex',
  height: '100%',
  flexGrow: 1,
  flexDirection: 'column',
  width: '100%',
  order: 2,
  ...themeUtils.responsiveStyle({
    xl: {
      order: 1,
      width: '65%',
    },
  }),
})

export const image = style({
  display: 'flex',
  maxWidth: 280,
  width: '100%',
  height: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  order: 1,
  ...themeUtils.responsiveStyle({
    xl: {
      order: 2,
      width: '35%',
      height: '100%',
    },
  }),
})
