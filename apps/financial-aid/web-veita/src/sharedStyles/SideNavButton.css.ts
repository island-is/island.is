import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const sideNavBarButton = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  width: '100%',
  borderRadius: '8px',
  padding: '4px',
})

export const sideNavBarButtonIcon = style({
  marginRight: theme.spacing[2],
  transition: 'transform 250ms ease',
})

export const activeNavButton = style({
  backgroundColor: theme.color.white,
})
