import { style } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

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
