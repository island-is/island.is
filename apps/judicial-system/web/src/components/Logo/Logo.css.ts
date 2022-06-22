import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const logoText = style({
  fontWeight: theme.typography.semiBold,
  textTransform: 'uppercase',
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
})

export const logoContainer = style({
  display: 'flex',
  flexDirection: 'row',

  '@media': {
    [`(min-width: ${theme.breakpoints.md}px) and (max-width: ${theme.breakpoints.lg}px)`]: {
      flexDirection: 'column',
    },
  },
})
