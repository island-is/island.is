import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  padding: 0,
})

export const processContainer = style({
  minHeight: 'calc(100vh - 112px)',
})

export const formStepperContainer = style({
  position: 'sticky',
  top: theme.spacing[4],
})

export const processContent = style({
  minHeight: '644px',
  paddingBottom: theme.spacing[5],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderRadius: theme.border.radius.large,
    },
  },
})

export const loadingWrapper = style({
  display: 'flex',
  height: 'calc(100vh - 168px)',
  alignItems: 'center',
  justifyContent: 'center',
})

export const link = style({
  textDecoration: 'underline',
})

export const name = style({
  whiteSpace: 'nowrap',
  textAlign: 'left',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      whiteSpace: 'inherit',
    },
  },
})
