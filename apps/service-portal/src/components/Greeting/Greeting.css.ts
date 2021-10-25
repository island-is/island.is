import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const wrapper = style({})

export const figure = style({
  paddingTop: '100%',
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
  backgroundImage: 'url(/minarsidur/assets/images/school.svg)',
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: '100%',
    },
    xl: {
      margin: `-${theme.spacing['5']}px 0`,
    },
  }),
})
