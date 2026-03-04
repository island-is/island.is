import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  display: 'grid',
  gap: theme.spacing[2],
})

export const twoCols = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const renderDividerFull = style({
  paddingBottom: theme.spacing[3],
  borderBottom: `2px solid ${theme.color.blue200}`,
})
