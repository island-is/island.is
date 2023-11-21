import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const container = style({
  maxWidth: '100%',
  marginLeft: 0,

  ...themeUtils.responsiveStyle({
    sm: {
      width: '546px',
      marginRight: theme.spacing[2],
    },
  }),
})

export const audio = style({
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
  padding: `${theme.spacing[1]}px ${theme.spacing.smallGutter}px`,
  margin: 0,
})
