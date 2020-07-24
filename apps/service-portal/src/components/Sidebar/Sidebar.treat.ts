import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const sidebar = style({
  height: '100%',
  borderRight: `1px solid ${theme.color.dark100}`,
})

export const navItem = style({
  display: 'block',
  ':hover': {
    color: theme.color.blue400,
    textDecoration: 'none',
  },
  transition: 'color 200ms',
})

export const subNavItem = style({
  display: 'block',
  fontSize: 15,
  paddingBottom: theme.spacing['1'],
})

export const navItemActive = style({
  fontWeight: 600,
})
