import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const feedbackPanelContainer = style({
  position: 'fixed',
  zIndex: 12000,
  bottom: 20,
  right: 20,
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.16)',
})

export const pushUp = style({
  bottom: 80,
  ...themeUtils.responsiveStyle({
    md: {
      bottom: 0,
    },
  }),
})
