import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const tag = style({
  marginBottom: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      marginBottom: 'unset',
      alignSelf: 'flex-start',
    },
  }),
})

export const image = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    sm: {
      display: 'flex',
      width: 66,
    },
  }),
})

export const avatar = style({
  ...themeUtils.responsiveStyle({
    sm: {
      height: 66,
    },
  }),
})

export const circleImg = style({
  height: 'auto',
  width: 'auto',
  display: 'flex',
  maxHeight: 38,
  maxWidth: 38,
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

export const loader = style({
  minHeight: 200,
})
