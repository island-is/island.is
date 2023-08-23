import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const filterTagRow = style({
  minHeight: '40px',
  marginBottom: '18px',
  marginTop: '24px',
})

export const filterInput = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: '480px',
    },
  }),
})

export const logo = style({
  objectFit: 'contain',
  ...themeUtils.responsiveStyle({
    xs: {
      minWidth: 60,
      maxWidth: 60,
    },
    lg: {
      minWidth: 80,
      maxWidth: 80,
    },
  }),
})

export const noWrap = style({
  display: 'flex',
  flexWrap: 'nowrap',
})
