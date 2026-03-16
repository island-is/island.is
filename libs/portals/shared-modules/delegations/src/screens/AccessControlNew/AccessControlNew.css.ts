import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const inputWrapper = style({
  maxWidth: 320,
  paddingBottom: theme.spacing[2],
  paddingTop: theme.spacing[3],
  paddingLeft: 12,
})

export const problemContainer = style({
  borderWidth: theme.border.width.standard,
  borderColor: theme.color.blue200,
  borderStyle: theme.border.style.solid,
  borderRadius: theme.border.radius.large,
})

globalStyle(`${problemContainer} > div`, {
  columnGap: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    lg: {
      columnGap: theme.spacing[4],
    },
    xl: {
      columnGap: theme.spacing[8],
    },
  }),
})

globalStyle(`${problemContainer} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
})

export const problemImg = style({
  width: 150,
  aspectRatio: '0.8',
  ...themeUtils.responsiveStyle({
    md: {
      width: '25%',
      flexShrink: 0,
    },
  }),
})
