import { style } from '@vanilla-extract/css'

export const frameWrapper = style({
  height: '646px',
  width: '100%',
  minHeight: 124,
  boxSizing: 'border-box',
  position: 'relative',
  background: 'transparent',
  outline: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const scroll = style({
  overflowX: 'scroll',
})

export const outerWrapper = style({
  width: '889px',
  minHeight: '156px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  alignItems: 'center',
})

export const innerWrapper = style({
  minHeight: '156px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
})

export const graphWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '889px',
  height: '100%',
})

export const graphParent = style({
  width: '90%',
  height: '420px',
})

export const pie = style({
  width: '100%',
  height: 'fit-content',
})
