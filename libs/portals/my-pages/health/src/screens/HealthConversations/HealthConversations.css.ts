import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const messageCard = style(
  themeUtils.responsiveStyle({
    xs: {
      borderWidth: 0,
      borderRadius: 0,
    },
    sm: {
      borderStyle: theme.border.style.solid,
      borderWidth: theme.border.width.standard,
      borderColor: theme.color.blue200,
      borderRadius: theme.border.radius.large,
    },
  }),
)

export const attachmentIcon = style({
  width: 20,
  height: 20,
})

export const backButton = style({})

globalStyle(
  `${backButton} span, ${backButton} span:hover, ${backButton} span:focus`,
  {
    boxShadow: 'none',
  },
)
