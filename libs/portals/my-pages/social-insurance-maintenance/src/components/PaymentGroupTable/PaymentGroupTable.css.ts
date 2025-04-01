import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const labelColumn = style({
  borderRight: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  zIndex: theme.zIndex.above,
  paddingLeft: theme.spacing[2],
  paddingRight: 0,
})

export const hidden = style({
  visibility: 'hidden',
  margin: 0,
  padding: 0,
})

export const subLabelColumn = style({
  borderRight: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  zIndex: theme.zIndex.above,
  paddingLeft: theme.spacing[2],
  paddingRight: 0,
})

export const labelCell = style({
  width: '246px',
})

export const sumColumn = style({
  borderLeft: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
  right: 0,
  overflow: 'hidden',
  position: 'sticky',
  zIndex: theme.zIndex.above,
})

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: theme.zIndex.above,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})
