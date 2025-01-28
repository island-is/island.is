import { style } from '@vanilla-extract/css'

export const itemContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '16px',
  margin: '0 auto',
  maxWidth: '768px',
})

export const createCategoryCardButtonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '32px',
})
