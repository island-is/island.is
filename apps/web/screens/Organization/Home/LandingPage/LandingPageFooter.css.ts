import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  ...themeUtils.responsiveStyle({
    xs: {
      gap: '12px',
    },
    lg: {
      flexFlow: 'row nowrap',
    },
  }),
})

export const item = style({
  marginRight: '12px',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
})

export const dotBefore = style({
  ...themeUtils.responsiveStyle({
    lg: {
      '::before': {
        content: '•',
        marginRight: '12px',
      },
    },
  }),
})
