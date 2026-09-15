import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const rowLink = style({
  display: 'block',
  textDecoration: 'none',
})

export const titleText = style({
  fontSize: 14,
  lineHeight: '24px',
  ...themeUtils.responsiveStyle({
    md: { fontSize: 18 },
  }),
})
