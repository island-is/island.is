import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const imageContainer = style({
  position: 'relative',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  ...themeUtils.responsiveStyle({
    xs: {
      display: 'none',
      maxWidth: '220px',
    },
    lg: {
      display: 'flex',
      maxWidth: '300px',
    },
    xl: {
      maxWidth: '440px',
    },
  }),
})
