import { style } from '@vanilla-extract/css'

export const heroContainer = style({
  minHeight: '242px',
  height: '242px',
})

export const mobileHeroContainer = style({
  overflow: 'visible',
})

export const coatOfArms = style({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  backgroundColor: 'white',
  bottom: '-60px',
  left: '160px',
  transform: 'translateX(-50%)',
})

export const mobileCoatOfArms = style({
  width: 'clamp(88px, 22vw, 120px)',
  height: 'clamp(88px, 22vw, 120px)',
  borderRadius: '50%',
  backgroundColor: 'white',
  bottom: '0',
  left: '86%',
  transform: 'translate(-50%, 50%)',
})

export const coatOfArmsImage = style({
  width: '80px',
  height: '80px',
})

export const mobileCoatOfArmsImage = style({
  width: 'clamp(56px, 14vw, 80px)',
  height: 'clamp(56px, 14vw, 80px)',
})
