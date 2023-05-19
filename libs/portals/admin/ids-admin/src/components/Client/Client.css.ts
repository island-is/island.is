import { style } from '@vanilla-extract/css'
import { spacing, themeUtils } from '@island.is/island-ui/theme'

export const select = style({
  flexGrow: 1,

  ...themeUtils.responsiveStyle({
    sm: {
      maxWidth: 230,
      width: '100%',
      display: 'grid',
      alignItems: 'center',
    },
  }),
})

export const tagWrapper = style({
  height: spacing['4'],
  transition: 'all 0.3s',
})

export const tagHide = style({
  opacity: 0,
  height: 0,
})
