import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const popularTitleWrap = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '315px',
      textAlign: 'center',
      margin: '0 auto',
    },
  }),
})

export const popularTitle = style({
  fontSize: 34,
  lineHeight: 44 / 34,
  fontWeight: 600,
  marginBottom: 30,
})
