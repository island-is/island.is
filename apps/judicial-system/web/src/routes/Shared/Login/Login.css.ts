import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const loginContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(5, auto)',
  maxWidth: '1440px',
  margin: `${theme.spacing[6]}px ${theme.spacing[3]}px 0`,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      margin: `${theme.spacing[30]}px auto 0`,
      padding: `${theme.spacing[6]}px`,
    },
  },
})

export const errorMessage = style({
  gridRow: '1',
  gridColumn: 'span 10',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: 'span 4',
    },
  },
})

export const titleContainer = style({
  gridRow: '2',
  gridColumn: 'span 10',
  marginBottom: 24,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: 'span 6',
    },
  },
})

export const subTitleContainer = style({
  gridRow: '3',
  gridColumn: 'span 10',
  marginBottom: 40,

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: 'span 6',
    },
  },
})

export const buttonContainer = style({
  gridRow: '4',
  gridColumn: 'span 6',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: 'span 4',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 2',
    },
  },
})
