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
  width: '24.5%',
  paddingTop: theme.spacing[5],
  paddingBottom: theme.spacing[7],
  display: 'none',
  gridTemplateRows: 'max-content auto max-content',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      paddingLeft: 'calc((100vw - 1440px)/2 + 24px)',
      width: 'calc((100vw - 1440px)/2 + (0.246 * 1440px))',
    },
  },
})

export const logoContainer = style({
  maxWidth: '160px',
  display: 'flex',
  marginBottom: theme.spacing[8],
})

export const logoHfjContainer = style({
  display: 'grid',
  gridTemplateColumns: 'max-content auto',
  alignItems: 'center',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[8],
})

export const logoHfj = style({
  width: theme.spacing[4],
  height: theme.spacing[6],
})

export const headline = style({
  position: 'relative',
  ':before': {
    content: '""',
    position: 'absolute',
    display: 'block',
    height: theme.spacing[3],
    width: '2px',
    left: '0px',
    backgroundColor: theme.color.purple200,
    top: 'calc((100%/2) - 12px)',
  },
})

export const otherItems = style({})

export const activeLink = style({
  backgroundColor: theme.color.white,
  borderRadius: theme.spacing[1],
})
