import { style } from '@vanilla-extract/css'

export const blockColumn = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const policeCaseNumbers = style({
  display: 'flex',
  alignItems: 'center',
  columnGap: '4px',
})
