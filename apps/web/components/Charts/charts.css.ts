import { style } from '@vanilla-extract/css'

export const list = style({
  color: '#00003C',
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '24px',
  flexWrap: 'nowrap',
})

export const dot = style({
  width: '12px',
  height: '12px',
  borderRadius: '12px',
  marginRight: '2px',
  marginLeft: '8px',
})

export const listWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
})

export const wrapper = style({
  paddingTop: '37px',
})

export const title = style({
  fontFamily: 'IBM Plex Sans',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '16px',
  color: '#00003C',
  paddingBottom: '12px',
})

export const tooltip = style({
  display: 'inline-block',
  backgroundColor: '#F2F7FF',
  borderRadius: '8px',
  padding: '20px',
  maxWidth: '240px',
  fontSize: '15px',
  lineHeight: '20px',
})
