import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const activeLink = style({
  backgroundColor: theme.color.white,
  borderRadius: theme.spacing[1],
})

export const link = style({
  display: 'block',
  padding: theme.spacing[1],
  borderRadius: theme.spacing[1],
  selectors: {
    '&:hover': {
      textDecoration: 'none !important',
    },
  },
})

export const linkHoverEffect = style({
  transition: 'background-color 250ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.purple200,
    },
  },
})

export const group = style({
  display: 'block',
  color: theme.color.dark300,
  fontSize: '14px',
  marginTop: theme.spacing[4],
  marginLeft: theme.spacing[1],
  marginBottom: theme.spacing[1],
})
