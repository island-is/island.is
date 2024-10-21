import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

export const dataContainer = style({
  display: 'grid',
  gap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr auto',
    },
  },
})
