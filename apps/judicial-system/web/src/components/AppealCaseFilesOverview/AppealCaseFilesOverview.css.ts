import { style } from '@vanilla-extract/css'

export const metadataRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

export const childContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  textAlign: 'right',
  minWidth: 0,
  maxWidth: '100%',
})
