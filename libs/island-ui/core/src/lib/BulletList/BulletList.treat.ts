import { style } from 'treat'
import { theme } from '../../theme/'

export const bullet = style({
  display: 'inline-block',
  width: '24px',
  color: theme.color.red400,
  fontWeight: theme.typography.semiBold,
})

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: '-2px',
})
