import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const subTableHeaderText = style({
  fontSize: 14,
  fontWeight: 600,
})

export const disabledTable = style({
  opacity: 0.5,
})

export const tableRowStyles = style({})

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

globalStyle(`${tableRowStyles} td, ${tableRowStyles} th`, {
  fontSize: '14px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
})
