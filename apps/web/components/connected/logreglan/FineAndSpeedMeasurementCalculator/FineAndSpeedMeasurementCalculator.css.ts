import { style } from '@vanilla-extract/css'

export const totalContainer = style({
  '@media': {
    [`screen and (min-width: 0px)`]: {
      minWidth: '70px',
    },
    [`screen and (min-width: 400px)`]: {
      minWidth: '130px',
    },
    [`screen and (min-width: 576px)`]: {
      minWidth: '180px',
    },
    [`screen and (min-width: 767px)`]: {
      minWidth: '160px',
    },
    [`screen and (min-width: 992px)`]: {
      minWidth: '200px',
    },
    [`screen and (min-width: 1440px)`]: {
      minWidth: '240px',
    },
  },
})

export const totalOuterContainer = style({
  position: 'sticky',
  top: '130px',
})
