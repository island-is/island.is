import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const linkText = style({})

export const forwardButton = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    sm: {
      width: 168,
    },
  }),
})

export const countryCheckboxContainer = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    lg: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  }),
})

globalStyle(`${linkText} *`, {
  fontWeight: 300,
})
