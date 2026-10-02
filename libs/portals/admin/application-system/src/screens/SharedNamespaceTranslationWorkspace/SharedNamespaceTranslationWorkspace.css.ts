import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const sharedNamespaceShell = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const toggleButton = style({
  marginBottom: 0,
})

export const localeStickyHeader = style({
  zIndex: theme.zIndex.above,
  background: theme.color.white,
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  borderBottom: `1px solid ${theme.color.blue200}`,
})
