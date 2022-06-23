import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const sectionNumber = style({
  fontWeight: theme.typography.semiBold,
  height: '32px',
  left: '-16px',
  top: 'calc(50% - 16px)',
  width: '32px',
})
