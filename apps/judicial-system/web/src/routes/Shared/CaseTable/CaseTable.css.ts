import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const logoContainer = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[5],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
    },
  },
})
