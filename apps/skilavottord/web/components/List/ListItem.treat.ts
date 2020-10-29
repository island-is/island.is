import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  width: '100%',
  borderStyle: 'solid',
  borderBottomWidth: 1,
  borderColor: theme.color.blue200,
  selectors: {
    [`&:first-child`]: {
      borderTopWidth: 1,
    },
  },
})
