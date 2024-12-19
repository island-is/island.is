import { style } from '@vanilla-extract/css'

export const frameWrapper = style({
  //height: '646px',
  width: '100%',
  minHeight: 124,
  boxSizing: 'border-box',
  position: 'relative',
  background: 'transparent',
  overflowX: 'scroll',
})

export const outerWrapper = style({
  width: '100%',
  height: '100%',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  alignItems: 'center',
})

export const innerWrapper = style({
  minHeight: '80px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
})

export const graphWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
})

export const graphParent = style({
  width: '100%',
  height: '420px',
})

export const pie = style({
  width: '100%',
  height: 'fit-content',
})
