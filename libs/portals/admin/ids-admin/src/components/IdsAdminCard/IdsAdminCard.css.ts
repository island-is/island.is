import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const cta = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const mobileTextRestriction = style({
  ...themeUtils.responsiveStyle({
    xs: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: 200,
      display: 'inline-block',
    },
    sm: {
      textOverflow: 'initial',
      overflow: 'initial',
      maxWidth: 'initial',
      display: 'initial',
    },
  }),
})
