import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const borderBottom = style({
  borderBottomStyle: 'solid',
  borderBottomWidth: 1,
  borderBottomColor: theme.color.blue200,
})

export const illustration = style({
  position: 'relative',
  height: 'auto',
  width: '100%',
  bottom: '-10%',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'initial',
      bottom: 0,
    },
  }),
})
