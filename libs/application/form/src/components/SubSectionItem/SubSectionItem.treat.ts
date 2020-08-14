import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const icon = style({
  position: 'relative',
  display: 'inline-block',
  top: '-2px',
  left: '2px',
})

export const bullet = style({
  display: 'inline-block',
  width: '32px',
})

export const textActive = style({
  fontWeight: theme.typography.semiBold,
})

export const textPrevious = style({
  fontWeight: theme.typography.semiBold,
})

export const textNext = style({
  fontWeight: theme.typography.regular,
})
