import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const width = 336
const breakpoint = 914 + width

export const wrapper = style({
  width: width,
  flex: '0 0 auto',
  marginRight: -width,
  backgroundColor: theme.color.white,
  borderLeft: `1px solid ${theme.color.dark100}`,
  transition: 'margin-right 400ms',
  '@media': {
    [`screen and (max-width: ${breakpoint}px)`]: {
      position: 'fixed',
      top: 80,
      right: 0,
      zIndex: 2,
    },
  },
})

export const active = style({
  marginRight: 0,
})
