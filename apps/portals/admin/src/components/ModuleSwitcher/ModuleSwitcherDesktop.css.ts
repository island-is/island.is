import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'spaceBetween',
  width: '290px',
  height: `${theme.headerHeight.large}px`,
  marginLeft: `${theme.spacing[5]}px`,
  boxShadow: `inset 1px 0 0 0 ${theme.color.blue200}, inset -1px 0 0 0 ${theme.color.blue200}`,
})

export const menuButton = style({
  width: '100%',
})

export const backdrop = style({
  background: 'rgba(242, 247, 255, 0.7)',
  zIndex: theme.zIndex.belowModal,
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

export const menuDropdown = style({
  zIndex: theme.zIndex.modal,
  marginTop: '-60px',
  width: '290px',
})
