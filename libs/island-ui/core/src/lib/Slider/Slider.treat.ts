import { style } from 'treat'
import { theme } from '../../theme'

export const navButton = style({
  backgroundColor: theme.color.blue100,
  borderRadius: '50%',
  width: 40,
  height: 40,
})

export const arrowIcon = style({
  lineHeight: 0,
})

export const rotated = style({
  transform: `rotate(180deg)`,
})

export const tester = style({
  outline: '1px solid red',
  width: '100%',
})
