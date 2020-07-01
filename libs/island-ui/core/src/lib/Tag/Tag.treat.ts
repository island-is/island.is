import { styleMap, style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: '5px',
  transition: 'color 150ms ease, background-color 150ms ease',
  selectors: {
    '&:focus, &:hover': {
      backgroundColor: theme.color.blue400,
      color: theme.color.white,
    },
  },
})

export const variant = styleMap({
  blue: {
    color: theme.color.blue400,
    backgroundColor: theme.color.blue100,
  },
  purple: {
    color: theme.color.purple400,
    backgroundColor: theme.color.purple100,
  },
})
