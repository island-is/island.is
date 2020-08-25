import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const filters = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  outline: '1px solid green',
  ...themeUtils.responsiveStyle({
    md: {
      flexDirection: 'row',
    },
  }),
})

export const input = style({})
