import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const dialog = style({
  height: '100vh',
  padding: `${theme.spacing[4]}px 0`,
  opacity: 0.8,
  background: 'rgba(255, 255, 255, 0.8)',
})
