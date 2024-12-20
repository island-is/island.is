import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  minHeight: 400,
})

export const answerRowContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, 1fr)',
  borderBottom: '1px solid lightgrey',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '5.3fr 3.7fr',
    },
  }),
})
