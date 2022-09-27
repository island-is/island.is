import { style } from '@vanilla-extract/css'

export const menuStyle = style({
  position: 'relative',
  zIndex: 20,
})

export const sidebarCardContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '24px',
})
