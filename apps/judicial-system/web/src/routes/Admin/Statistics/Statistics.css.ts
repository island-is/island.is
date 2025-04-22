import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const statisticsPageContainer = style({
  minHeight: 'calc(100vh - 112px)',
  padding: '48px 0',
  display: 'grid',
  gridTemplateColumns: '.8fr auto',
  justifyContent: 'center',
})

export const statisticsContentBox = style({
  minHeight: '644px',
  paddingBottom: theme.spacing[5],
  background: theme.color.white,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRadius: theme.border.radius.large,
    },
  },
})

export const statisticsSidebarContainer = style({
  padding: '80px 0 48px 0',
  background: theme.color.white,
})

export const statisticsSectionDivider = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
})
