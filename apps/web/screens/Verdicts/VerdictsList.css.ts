import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const searchInput = style({
  maxWidth: '774px',
})

export const mainContainer = style({
  minHeight: '330px',
})

export const crossmark = style({
  marginLeft: '8px',
  fontSize: '0.75rem',
  fontWeight: 'normal',
})

export const logo = style({
  height: '162px',
  width: 'auto',
})

export const verdictsWebsiteLink = style({
  fontSize: '14px',
})

export const verdictsWebsiteLinksDropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 10,
  marginTop: theme.spacing[1],
  backgroundColor: theme.color.white,
  boxShadow: theme.shadows.strong,
  borderRadius: theme.border.radius.large,
})

export const verdictsWebsiteLinksDropdownToggle = style({
  width: 'fit-content',
  gap: '4px',
})
