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
  width: '100%',
  background: theme.color.white,
  minHeight: '644px',
  minWidth: '350px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      padding: `${theme.spacing[4]}px `,
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: `${theme.spacing[4]}px ${theme.spacing[6]}px`,
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      borderRadius: theme.border.radius.large,
      padding: `${theme.spacing[8]}px ${theme.spacing[10]}px`,
      maxWidth: '1100px',
    },
  },
})
