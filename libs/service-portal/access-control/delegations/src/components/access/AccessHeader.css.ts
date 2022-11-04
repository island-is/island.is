import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const row = style({
  justifyContent: 'space-between',
  rowGap: theme.spacing[6],
  flexDirection: 'column-reverse',
  ...themeUtils.responsiveStyle({
    md: {
      flexDirection: 'row',
    },
  }),
})

export const rightColumn = style({
  width: '100%',
})
