import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  display: 'inline-block',
  height: 'auto',
  width: '100%',
})

export const defaultIllustration = style({
  position: 'relative',
  bottom: '-10%',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'initial',
      bottom: 0,
    },
  }),
})
