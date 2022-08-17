import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

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
export const avatar = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
      width: 66,
      height: 66,
    },
  }),
})

export const button = style({
  ...themeUtils.responsiveStyle({
    sm: {
      alignSelf: 'flex-end',
    },
  }),
})

export const logo = style({
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
})

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})
