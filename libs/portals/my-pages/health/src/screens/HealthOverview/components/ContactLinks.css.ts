import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const rowLink = style({
  display: 'block',
  textDecoration: 'none',
  ':focus-visible': {
    outline: `3px solid ${theme.color.mint400}`,
    outlineOffset: -3,
  },
})

export const titleText = style({
  fontSize: 14,
  lineHeight: '24px',
  ...themeUtils.responsiveStyle({
    md: { fontSize: 18 },
  }),
})
