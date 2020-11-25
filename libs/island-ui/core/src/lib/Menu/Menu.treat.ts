import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'
import bg from './bg.svg'

export const container = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: '100%',
      minHeight: '100%',
      background: theme.color.white,
      display: 'flex',
    },
  }),
})

export const main = style({
  ...themeUtils.responsiveStyle({
    md: {
      flexBasis: '66.66666%',
      backgroundImage: `url(${bg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 546,
      backgroundPosition: `top 579px right ${theme.spacing[15]}px`,
      flexGrow: 1,
    },
  }),
})

export const mainContainer = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 829,
    },
  }),
})

export const aside = style({
  ...themeUtils.responsiveStyle({
    md: {
      flexBasis: '33.33333%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  }),
})

export const asideTop = style({
  backgroundColor: theme.color.blue100,
})

export const asideBottom = style({
  backgroundColor: theme.color.blue200,
  flexGrow: 1,
})
export const asideContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 342,
    },
  }),
})
