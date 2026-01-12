import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  background: 'linear-gradient(98.23deg, #015493 11.63%, #0173CD 121.98%)',
})

export const mainColumn = style({
  paddingTop: '30px',
  paddingBottom: '24px',
})

export const gridRow = style({
  paddingTop: '16px',
})

export const line = style({
  borderTop: '1px solid white',
})

export const locationBox = style({
  minHeight: '100px',
})

export const offset = style({
  ...themeUtils.responsiveStyle({
    xs: {
      marginLeft: '48px',
    },
    sm: {
      marginLeft: '86px',
    },
  }),
})
