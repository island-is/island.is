import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const twoColumnGrid = style({
  display: 'grid',
  alignItems: 'flex-end',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const gridVariants = styleVariants({
  small: [twoColumnGrid, { gap: theme.spacing[1] }],
  medium: [twoColumnGrid, { gap: theme.spacing[2] }],
})
