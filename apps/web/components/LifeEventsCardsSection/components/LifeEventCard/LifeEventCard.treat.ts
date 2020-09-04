import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const thumbnail = style({
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  width: 137,
  height: 156,
  flex: 'none',
})

export const card = style({
  ':hover': {
    borderColor: theme.color.purple400,
  },
})
