import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const fieldWithDivider = style({
  position: 'relative',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: theme.spacing[3],
      '::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: theme.color.blue200,
      },
    },
  },
})

export const illustrationWrapper = style({
  flexShrink: 0,
})

export const illustrationImg = style({
  width: 228,
  height: 228,
  objectFit: 'contain',
})
