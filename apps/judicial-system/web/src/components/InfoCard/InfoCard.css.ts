import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoCardContainer = style({
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

export const infoCardTitleContainer = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
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

export const infoCardCourtOfAppealDataContainer = style({
  display: 'grid',
  gap: theme.spacing[2],
  borderTop: `2px solid ${theme.color.blue200}`,
  paddingTop: theme.spacing[3],
  marginTop: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
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
