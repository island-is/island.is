import { style } from '@vanilla-extract/css'

export const container = style({
  width: '80%',
  margin: '16px auto',
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
})

export const rolesContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '8px',
})

export const checkboxContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const menuContainer = style({
  overflowY: 'scroll',
  height: '400px',
})
