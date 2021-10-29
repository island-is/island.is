import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const modal = style({
  position: 'relative',
  maxWidth: 1000,
  width: '100%',
  margin: `${theme.spacing['6']}px auto`,
  borderRadius: theme.border.radius.large,
  overflowY: 'auto',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
})

export const gridContainer = style({
  margin: 0,
  padding: 0,
})
