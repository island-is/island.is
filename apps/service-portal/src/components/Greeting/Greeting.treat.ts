import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const wrapper = style({})

export const figure = style({
  paddingTop: '100%',
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
  backgroundImage: 'url(/assets/images/school.jpg)',
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: '100%',
    },
    xl: {
      margin: `-${theme.spacing['5']}px 0`,
    },
  }),
})
