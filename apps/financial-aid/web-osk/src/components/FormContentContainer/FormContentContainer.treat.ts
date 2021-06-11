import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const footerContainer = style({
  borderTop: `${theme.border.width.large}px solid ${theme.color.purple100}`,
  paddingTop: theme.spacing[5],
})

export const formContainer = style({
  gridColumn: '1/-1',
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      gridColumn: '2/10',
      paddingLeft: `0px`,
      paddingRight: `0px`,
    },
  },
})
