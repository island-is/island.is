import { style } from 'treat'
import { theme } from '../../utils/theme'

export const withDecorator = style({
  borderBottom: `1px solid ${theme.color.blue200}`,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      borderBottom: 'none',
      borderRight: `1px solid ${theme.color.blue200}`,
    },
  },
})
