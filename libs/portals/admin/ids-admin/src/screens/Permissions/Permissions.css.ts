import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const emptyContainer = style({
  maxWidth: 550,
})

export const headerContainer = style({
  display: 'grid',

  ...themeUtils.responsiveStyle({
    sm: {
      gridTemplateColumns: '1fr auto',
    },
  }),
})
