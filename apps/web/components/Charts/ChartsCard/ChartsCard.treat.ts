import { style } from 'treat'

export const frameWrapper = style({
  display: 'flex',
  height: '646px',
  width: '100%',
  flexDirection: 'column',
  boxSizing: 'border-box',
  minHeight: 124,
  textDecoration: 'none',
  overflowX: 'scroll',
  position: 'relative',
  // overflow: 'visible',
  background: 'transparent',
  outline: 'none',
  ':hover': {
    textDecoration: 'none',
  },
})

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  alignItems: 'stretch',
  justifyContent: 'flexStart',
})

export const outerWrapper = style({
  width: '100%',
  minHeight: '156px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  alignItems: 'center',
  justifyContent: 'spaceBetween',
})

export const innerWrapper = style({
  minHeight: '156px',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  paddingBottom: '24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const graphWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
})

export const graphParent = style({
  justifyContent: 'center',
  width: '90%',
  height: '80%',
})
