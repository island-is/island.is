import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { color } = theme

export const wrapper = style({
  selectors: {
    '& ins': {
      padding: `0 0.125em`,
      textDecorationColor: 'none',
      backgroundColor: color.mint200,
    },
    '& del': {
      padding: `0 0.125em`,
      textDecorationColor: 'rgba(0, 0, 0, 0.5)',
      backgroundColor: color.red200,
    },
  },
})
