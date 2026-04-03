import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const link = style({
  textDecoration: 'underline',
})

export const modal = style({
  width: 357,
  position: 'fixed',
  zIndex: 10000,
  bottom: theme.spacing[2],
  right: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      bottom: theme.spacing[3],
      right: theme.spacing[3],
    },
  }),
  transition: 'opacity 0.3s ease',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.16)',
})

export const inlineModal = style({
  width: '100%',
  maxWidth: 'none',
  position: 'absolute',
  zIndex: 2,
  inset: 0,
  bottom: 'auto',
  right: 'auto',
  boxShadow: 'none',
})
