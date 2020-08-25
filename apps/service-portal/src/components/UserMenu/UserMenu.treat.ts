import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: 266,
    },
  }),
})
