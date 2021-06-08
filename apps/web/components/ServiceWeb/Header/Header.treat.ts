import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { DESKTOP_HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '../constants'

export const header = style({
  height: MOBILE_HEADER_HEIGHT,
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEADER_HEIGHT,
    },
  }),
})

export const logoTitleContainer = style({
  position: 'relative',
  paddingLeft: 32,
  marginLeft: 32,
  ':before': {
    content: '""',
    position: 'absolute',
    top: -12,
    left: 0,
    backgroundColor: theme.color.white,
    width: 1,
    height: 56,
    opacity: 0.5,
  },
})
