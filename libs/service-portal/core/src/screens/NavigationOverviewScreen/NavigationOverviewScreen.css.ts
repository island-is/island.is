import { themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const image = style({
  width: 120,
  ...themeUtils.responsiveStyle({
    sm: {
      width: 'inherit',
    },
  }),
})
