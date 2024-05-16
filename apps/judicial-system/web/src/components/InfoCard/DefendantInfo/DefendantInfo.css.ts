import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const gridRow = style({
  display: 'grid',
  gridTemplateColumns: '5fr 1fr',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})

export const infoCardDefendant = style({
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})
