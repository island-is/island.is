import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const closeBtn = style({
  position: 'absolute',
  top: theme.spacing[3],
  right: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'relative',
      top: 'initial',
      right: 'initial',
    },
  }),
  ':after': {
    content: '""',
    position: 'absolute',
    left: -theme.spacing[1],
    right: -theme.spacing[1],
    top: -theme.spacing[1],
    bottom: -theme.spacing[1],
  },
})
