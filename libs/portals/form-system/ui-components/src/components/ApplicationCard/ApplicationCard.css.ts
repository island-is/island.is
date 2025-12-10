import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const draftProgressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})

export const progressMeter = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: '60%',
    },
  }),
})

export const tag = style({
  marginBottom: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      marginBottom: 'unset',
      alignSelf: 'flex-start',
    },
  }),
})

export const logo = style({
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
})
