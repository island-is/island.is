import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const sideNavBarButton = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
})

export const sideNavBarButtonIcon = style({
  marginRight: theme.spacing[2],
  transition: 'transform 250ms ease',
})
