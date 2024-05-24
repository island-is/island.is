import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const caseInfoSection = style({
  display: 'grid',
  gap: theme.spacing[2],
})

export const caseInfoItem = style({
  borderTop: `2px solid ${theme.color.blue200}`,
  paddingTop: theme.spacing[3],
  marginTop: theme.spacing[3],
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
