import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridLayout = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing[2],
  marginTop: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'auto auto',
    },
  },
})

export const motionBox = style({
  marginTop: `${theme.spacing[2]}px`,
})
