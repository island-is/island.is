import { style } from 'treat'
import { theme } from '../../theme'

export const badge = style({
  width: 18,
  height: 18,
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
  fontSize: 11,
  lineHeight: 0,
  borderRadius: '50%',
})

export const position = style({
  top: -9,
  left: -9,
})
