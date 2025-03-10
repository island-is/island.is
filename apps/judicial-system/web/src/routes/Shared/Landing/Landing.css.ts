import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const landingContainer = style({
  minHeight: 'calc(100vh - 112px)',
})

export const container = style({
  padding: 0,
})

export const processContent = style({
  minHeight: '736px',
  paddingBottom: theme.spacing[5],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRadius: theme.border.radius.large,
    },
  },
})
