import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})

export const inputContainer = style({
  display: 'block',
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 150ms ease-in-out',
  gridTemplateColumns: 'repeat(6, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  // '@media': {
  //   [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
  //     display: 'grid',
  //     gridTemplateColumns: 'repeat(8, 1fr)',
  //   },
  // },
})

export const inputAppear = style({
  maxHeight: '192px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      maxHeight: '110px',
    },
  },
})
