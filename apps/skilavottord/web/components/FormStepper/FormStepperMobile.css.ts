import { style } from '@vanilla-extract/css'

export const stepContainer = style({
  selectors: {
    [`&::-webkit-scrollbar`]: {
      display: 'none',
    },
  },
})

export const step = style({
  whiteSpace: 'nowrap',
})

export const activeIcon = style({
  height: '32px',
  width: '32px',
})

export const inProgressIcon = style({
  height: '16px',
  width: '16px',
})
