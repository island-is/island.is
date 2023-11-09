import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const tableRowStyle = style({})

export const tableFootCell = style({
  fontWeight: 'bold',
})

globalStyle(`${tableRowStyle} > th, ${tableRowStyle} > td`, {
  fontSize: '14px',
  whiteSpace: 'nowrap',
})

export const selectButton = recipe({
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
