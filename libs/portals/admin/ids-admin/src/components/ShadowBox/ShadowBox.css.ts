import { recipe } from '@vanilla-extract/recipes'

export const shadow = recipe({
  base: {
    background:
      'linear-gradient(270deg, rgba(0, 97, 255, 0) 0%, rgba(0, 97, 255, 0.16) 50%, rgba(0, 97, 255, 0) 100%);',
    bottom: '-10px',
    left: 0,
    right: 0,
    position: 'sticky',
    height: '30px',
    filter: 'blur(30px)',
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
  },
  variants: {
    showShadow: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
})
