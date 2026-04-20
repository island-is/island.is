import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const isIsolationGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: `${theme.spacing[2]}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr auto',
    },
  },
})
