import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const formFooter = style({
  display: 'grid',
  gap: theme.spacing[2],
  gridTemplateColumns: '1fr auto',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      alignItems: 'center',
    },
  },
})

export const continueButton = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: '2',
      justifySelf: 'end',
    },
  },
})

export const actionButton = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: '2',
    },
  },
})

export const buttonContainer = style({
  display: 'flex',
  gap: theme.spacing[2],
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: '2',
      justifyContent: 'flexEnd',
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
})

export const infoBoxContainer = style({
  maxWidth: '304px',
  width: '100%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px) and (min-width: ${theme.breakpoints.md}px)`]:
      {
        maxWidth: 'unset',
      },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      maxWidth: '376px',
    },
  },
})
