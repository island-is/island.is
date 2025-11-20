import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const mainColumn = style({
  maxWidth: '1200px',
  width: '100%',
  marginLeft: 0,
  border: `1px solid ${theme.border.color.blue200}`,
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
  minHeight: '800px',
})

export const mainContentContainer = style({
  minHeight: '500px',
  maxHeight: '70vh',
})
