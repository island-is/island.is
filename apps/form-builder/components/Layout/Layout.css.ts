import { style } from '@vanilla-extract/css'

export const processContainer = style({
  minHeight: '100vh',
})

export const contentContainer = style({
  maxWidth: '100vw',
})

export const container = style({
  display: 'flex',
  justifyContent: 'center',
  height: '100vh',
})

export const contentWrapper = style({
  //maxWidth: '1140px',
  width: '100%',
  padding: '1rem 1rem',
})
