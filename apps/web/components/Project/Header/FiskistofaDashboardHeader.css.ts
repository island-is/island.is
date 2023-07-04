import { style } from '@vanilla-extract/css'

export const logo = style({
  height: '70px',
})

export const title = style({
  color: '#007489',
})

export const background = style({
  position: 'relative',
  background: 'linear-gradient(180deg, #E6F2FB 21.56%, #90D9E3 239.74%)',
})

export const leftCloud = style({
  position: 'absolute',
  pointerEvents: 'none',
  left: '7%',
  top: '40%',
})

export const centerCloud = style({
  position: 'absolute',
  pointerEvents: 'none',
  left: '33%',
  top: '50%',
})

export const rightCloud = style({
  position: 'absolute',
  pointerEvents: 'none',
  right: '400px',
  top: '12%',
})
