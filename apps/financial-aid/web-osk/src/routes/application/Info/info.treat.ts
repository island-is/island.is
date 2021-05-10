import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const iconMargin = style({
  marginRight: theme.spacing[2],
})

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
