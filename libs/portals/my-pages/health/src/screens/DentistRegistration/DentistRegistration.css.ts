import { recipe } from '@vanilla-extract/recipes'

export const saveButtonWrapperStyle = recipe({
  base: {
    position: 'relative',
  },
  variants: {
    visible: {
      true: {
        opacity: 1,
        zIndex: 1,
      },
      false: {
        opacity: 0,
        zIndex: -1,
      },
    },
  },
})
