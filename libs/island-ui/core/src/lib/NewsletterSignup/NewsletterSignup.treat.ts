import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const buttonWrap = style({
  flex: '1 0 auto',
})

export const inputWrap = style({
  flex: '0 1 70%',
})

export const variants = styleMap({
  white: {
    backgroundColor: 'white',
  },
  blue: {
    backgroundColor: theme.color.blue100,
  },
})
