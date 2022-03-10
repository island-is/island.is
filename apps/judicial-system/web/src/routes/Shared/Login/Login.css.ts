import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const loginContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(5, auto)',
  maxWidth: '1440px',
  margin: `${theme.spacing[30]}px auto 0`,
  padding: `${theme.spacing[6]}px`,
})

export const errorMessage = style({
  gridRow: '1',
  gridColumn: '2 / span 4',
})

export const titleContainer = style({
  gridRow: '2',
  gridColumn: '2 / span 6',
  marginBottom: 24,
})

export const subTitleContainer = style({
  gridRow: '3',
  gridColumn: '2 / span 6',
  marginBottom: 40,
})

export const buttonContainer = style({
  gridRow: '4',
  gridColumn: '2 / span 2',
})

export const btn = style({
  ':hover': {
    textDecoration: 'none',
  },
})
