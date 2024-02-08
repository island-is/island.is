import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const inputContainer = style({
  ...themeUtils.responsiveStyle({
    sm: { width: '432px' },
  }),
})

export const yearSelectContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      width: '100%',
    },
    sm: {
      width: '432px',
    },
    md: { width: '432px' },
    lg: {
      width: '318px',
    },
  }),
})

export const fullWidth = style({
  width: '100%',
})

export const textMaxWidth = style({
  maxWidth: '793px',
})
