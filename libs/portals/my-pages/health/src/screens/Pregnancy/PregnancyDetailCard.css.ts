import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const grid = style({
  flexGrow: 1,
  display: 'grid',
  gridTemplateColumns: '1fr',
  rowGap: theme.spacing[3],
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns: '1fr 1fr',
      columnGap: theme.spacing[4],
    },
  }),
})

export const dividerCell = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderLeft: `1px solid ${theme.color.blue200}`,
      paddingLeft: theme.spacing[4],
    },
  }),
})

export const image = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'block',
      alignSelf: 'center',
      maxHeight: 170,
    },
  }),
})
