import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const headerBorder = style({
  height: '100%',
  borderBottom: '8px solid #6EDC37;',
})

export const headerBorderWidth = style({
  maxWidth: '1342px',
  margin: '0 auto',
})

export const gridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '307px',
      gridTemplateColumns: '55fr 45fr',
    },
  }),
})
