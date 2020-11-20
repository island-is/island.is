import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const stepDot = style({
  width: theme.spacing['1'],
  height: theme.spacing['1'],
  borderRadius: 50,
  transition: 'width 250ms ease, background-color 250ms ease',
})

export const stepDotActive = style({
  width: theme.spacing['2'],
  ...themeUtils.responsiveStyle({
    sm: {
      width: theme.spacing['4'],
    },
  }),
})
