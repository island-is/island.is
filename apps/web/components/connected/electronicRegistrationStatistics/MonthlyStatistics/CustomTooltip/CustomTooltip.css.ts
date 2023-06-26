import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'inline-block',
  backgroundColor: '#F2F7FF',
  borderRadius: '8px',
  padding: '20px',
  maxWidth: '240px',
  fontSize: '15px',
})

export const listItemOuterContainer = style({
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '24px',
  flexWrap: 'nowrap',
})

export const listItemInnerContainer = style({
  width: '12px',
  height: '12px',
  borderRadius: '12px',
  marginRight: '2px',
  marginLeft: '8px',
})
