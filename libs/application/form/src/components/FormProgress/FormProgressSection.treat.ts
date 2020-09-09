import { style } from 'treat'

export const subSectionContainer = style({
  overflowY: 'hidden',
  transition: 'height .5s ease-in-out',
})

export const subSectionInnerContainer = style({
  opacity: 0,
  transition: 'opacity .3s ease-in-out',
})
