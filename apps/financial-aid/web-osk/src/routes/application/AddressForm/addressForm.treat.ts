import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const radioButtonContainer = style({
  marginBottom: theme.spacing[3],
  backgroundColor: theme.color.blue100,
})

export const inputContainer = style({
  display: 'grid',
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
  gridTemplateColumns: 'repeat(6, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
})

export const inputAppear = style({
  maxHeight: '300px',
})

export const homeAddress = style({
  gridColumn: 'span 6',
  marginBottom: theme.spacing[3],
})

export const zipCode = style({
  gridColumn: 'span 4',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 2',
    },
  },
})
