import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const radioButtonContainer = style({
  marginBottom: theme.spacing[3],
})

export const radiobuttonError = style({
  backgroundColor: theme.color.red100,
})

export const inputContainer = style({
  display: 'block',
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 150ms ease-in-out',
  gridTemplateColumns: 'repeat(6, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
})

export const inputAppear = style({
  maxHeight: '192px',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      maxHeight: '80px',
    },
  },
})

export const homeAddress = style({
  gridColumn: 'span 6',
  marginBottom: theme.spacing[3],
})

export const zipCode = style({
  gridColumn: 'span 2',
  marginBottom: theme.spacing[3],
})
