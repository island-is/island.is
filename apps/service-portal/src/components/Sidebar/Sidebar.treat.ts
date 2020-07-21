import { style } from 'treat'

export const sidebar = style({
  display: 'flex',
  height: '100vh',
  maxWidth: '366px',
  minWidth: '366px',
  width: '100%',
  borderRight: '1px solid #F2F2F5',
  top: 0,
  position: 'sticky',
})

export const sidebarContainer = style({})

export const iconWrapper = style({
  position: 'absolute',
  left: ' -40px',
  top: '50%',
  transform: 'translateY(-50%)',
})
