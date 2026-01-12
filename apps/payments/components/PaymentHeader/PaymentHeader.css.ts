import { theme } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'

export const header = styleVariants({
  primary: {
    backgroundColor: theme.color.purple100,
    color: theme.color.purple400,
  },
  info: {
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
  },
  success: {
    backgroundColor: theme.color.mint100,
    color: 'white',
  },
  warning: {
    backgroundColor: theme.color.yellow200,
    color: 'white',
  },
  error: {
    backgroundColor: theme.color.red100,
    color: 'white',
  },
})
