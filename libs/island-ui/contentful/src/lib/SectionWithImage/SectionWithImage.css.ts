import { style } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const imageContainer = style({
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  overflow: 'hidden',
  width: '100%',
  height: 'auto',
  ...themeUtils.responsiveStyle({
    lg: {
      justifyContent: 'center',
    },
  }),
})

export const image = style({
  width: '100%',
  maxWidth: 150,
  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: 300,
    },
  }),
})

export const sectionOffset = style({
  marginLeft: 0,
  ...themeUtils.responsiveStyle({
    xl: {
      // span extra column left and right on XL screen
      marginLeft: theme.grid.gutter.desktop * -4,
      marginRight: theme.grid.gutter.desktop * -4,
    },
  }),
})
