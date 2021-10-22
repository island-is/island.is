import { styleVariants } from '@vanilla-extract/css'

export const placeholder = styleVariants({
  small: {
    width: 16,
    height: 16,
  },
  medium: {
    width: 24,
    height: 24,
  },
  large: {
    width: 32,
    height: 32,
  },
})
