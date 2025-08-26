import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  border: `1px dashed ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,

  padding: `${theme.spacing[2]}px`,
  marginBottom: `${theme.spacing[10]}px`,
  transition: 'border-color 0.2s ease-in-out',

  selectors: {
    '&:hover': {
      borderColor: theme.color.blue400,
    },
  },

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      padding: `${theme.spacing[10]}px`,
    },
  },
})

export const bottomContainer = style({
  marginBottom: `${theme.spacing[4]}px`,
})
