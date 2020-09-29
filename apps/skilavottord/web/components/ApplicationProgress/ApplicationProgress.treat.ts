import { style } from 'treat'

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

export const activeNumberContainer = style({
  height: '32px',
  width: '32px',
})

export const notStarted = style({
  height: '16px',
  width: '16px',
})
