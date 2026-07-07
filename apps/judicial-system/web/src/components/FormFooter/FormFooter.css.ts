import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const formFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
  },
})

export const previousButtonContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      marginRight: 'auto',
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
