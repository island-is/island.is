import { style } from '@vanilla-extract/css'

export const footer = style({
  background:
    'linear-gradient(360deg, rgba(182, 211, 216, 0.5092) -27.29%, rgba(138, 181, 185, 0.5776) 33.96%, rgba(69, 135, 138, 0.6384) 129.36%, rgba(19, 101, 103, 0.722) 198.86%)',
})

export const noWrap = style({
  display: 'flex',
  flexFlow: 'row nowrap',
})
