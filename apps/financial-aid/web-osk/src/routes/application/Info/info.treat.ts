import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const logo = style({
  maxWidth: '267px',
  display: 'block',
})

export const logoContainer = style({
  display: 'none',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
    },
  },
})

export const marginBottom = style({
  marginBottom: theme.spacing[10],
})

export const textIconContainer = style({
  display: 'grid',
  gridTemplateColumns: '32px auto',
  columnGap: '16px',
  alignItems: 'center',
})
