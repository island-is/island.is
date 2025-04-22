import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const statisticsPageContainer = style({
  minHeight: '100vh',
  background: theme.color.purple100,
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '48px',
  paddingBottom: '48px',
})

export const statisticsContentBox = style({
  background: theme.color.white,
  minHeight: '644px',
  width: '100%',
  maxWidth: '1200px',
  padding: `${theme.spacing[4]}px`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: `${theme.spacing[10]}px ${theme.spacing[6]}px`,
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      padding: `${theme.spacing[10]}px ${theme.spacing[12]}px`,
    },
  },
})
