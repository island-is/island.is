import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const baseContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'spaceBetween',
  width: '290px',
  height: theme.headerHeight.large,
  marginLeft: theme.spacing[5],
})

export const container = styleVariants({
  normal: [
    baseContainer,
    {
      boxShadow: `inset 1px 0 0 0 ${theme.color.blue200}, inset -1px 0 0 0 ${theme.color.blue200}`,
    },
  ],
  skipRightBorder: [
    baseContainer,
    {
      boxShadow: `inset 1px 0 0 0 ${theme.color.blue200}`,
    },
  ],
})

export const menuButton = style({
  width: '100%',
})

export const backdrop = style({
  background: 'rgba(242, 247, 255, 0.7)',
  zIndex: theme.zIndex.belowModal,
  position: 'fixed',
  inset: 0,
})

export const menuDropdown = style({
  zIndex: theme.zIndex.modal,
  width: '290px',
})
