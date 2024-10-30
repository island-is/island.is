import { style } from '@vanilla-extract/css'

export const childNodeContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '12px',
})

export const addNodeButtonContainer = style({
  display: 'flex',
  justifyContent: 'center',
  border: '1px dashed #d3dce0',
  padding: '10px 4px',
})
