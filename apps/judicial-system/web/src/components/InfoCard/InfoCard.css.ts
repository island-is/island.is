import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const infoCardTitleContainer = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
})

export const infoCardContainer = style({
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

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

export const renderDivider = style({
  position: 'relative',
  marginBottom: theme.spacing[3],

  '::after': {
    content: "''",
    position: 'absolute',
    top: -theme.spacing[1],
    display: 'block',
    width: '100%',
    height: '2px',
    backgroundColor: theme.color.blue200,
  },
})

// TODO: Put everywhere?
export const renderDividerFull = style({
  paddingBottom: theme.spacing[3],
  borderBottom: `2px solid ${theme.color.blue200}`,
})

export const last = style({
  marginBottom: theme.spacing[0],
})
