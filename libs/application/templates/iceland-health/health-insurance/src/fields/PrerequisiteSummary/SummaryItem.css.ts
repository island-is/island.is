import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const sectionNumber = style({
  borderRadius: '50%',
  fontWeight: theme.typography.semiBold,
  height: '32px',
  left: '-16px',
  top: 'calc(50% - 16px)',
  width: '32px',
  background: theme.color.purple400,
})

export const borderRadiusLargeTopOnly = style({
  borderRadius: '8px 8px 0 0',
})

export const sectionNumberText = style({
  color: theme.color.white,
  marginLeft: '-1px',
})
