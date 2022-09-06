import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const greetingContainer = style({
  marginBottom: theme.spacing[6],
})

export const greetingContainerRelative = style({
  position: 'relative',
})

export const absoluteImage = style({
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'absolute',
      top: 50,
      right: 20,
    },
    xl: {
      position: 'absolute',
      top: 23,
      right: 82,
    },
  }),
})

export const flexImage = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
