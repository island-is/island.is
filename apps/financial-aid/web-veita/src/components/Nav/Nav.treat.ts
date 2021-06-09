import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'fixed',
  left: 0,
  bottom: 0,
  top: 0,
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[6],
  backgroundColor: theme.color.purple100,
  width: '25.4%',
  paddingTop: theme.spacing[5],
  paddingBottom: theme.spacing[7],
  display: 'none',
  gridTemplateRows: 'max-content auto max-content',
  alignItems: 'center',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
      paddingLeft: theme.spacing[6],
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      paddingLeft: 'calc((100vw - 1440px)/2 + 48px)',
      width: 'calc((100vw - 1440px)/2 + (0.254 * 1440px))',
    },
  },
})

export const logoContainer = style({
  marginBottom: theme.spacing[8],
})

export const logoHfjContainer = style({
  display: 'grid',
  gridTemplateColumns: 'max-content auto',
  alignItems: 'center',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[8],
})

export const otherItems = style({})

export const activeLink = style({
  backgroundColor: theme.color.white,
  borderRadius: theme.spacing[1],
})

export const link = style({
  display: 'block',
  padding: theme.spacing[1],
  marginBottom: theme.spacing[1],
})
