import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'fixed',
  left: 0,
  bottom: 0,
  top: 0,
  paddingLeft: theme.spacing[3],
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
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[8],
})

export const logoHfj = style({
  width: theme.spacing[5],
  height: theme.spacing[5],
  backgroundColor: theme.color.purple200,
  paddingRight: '16px',
  borderRight: `2px solid ${theme.color.purple200}`,
})

export const otherItems = style({})
