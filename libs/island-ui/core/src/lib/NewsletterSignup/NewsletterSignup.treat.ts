import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const buttonWrap = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const variants = styleMap({
  white: {
    backgroundColor: 'white',
  },
  blue: {
    backgroundColor: theme.color.blue100,
  },
})
