import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoCardContainer = style({
  position: 'relative',
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

export const infoCardDataContainer = style({
  display: 'grid',
  gap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})
