import { style } from 'treat'

export const processContainer = style({
  minHeight: 'calc(100vh - 112px)',
})

export const processContent = style({
  minHeight: '644px',
})

export const loadingWrapper = style({
  display: 'flex',
  height: 'calc(100vh - 168px)',
  alignItems: 'center',
  justifyContent: 'center',
})

export const link = style({
  textDecoration: 'underline',
})
