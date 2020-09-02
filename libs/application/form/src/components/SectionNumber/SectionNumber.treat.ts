import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const number = style({
  width: 32,
  height: 32,
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
  fontSize: 18,
  lineHeight: 0,
  borderRadius: '50%',
  top: -1,
  left: 0,
})

export const progressLine = style({
  width: 4,
  left: '45%',
  top: '50%',
})
