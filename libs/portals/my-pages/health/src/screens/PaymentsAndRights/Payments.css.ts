import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const linkText = style({})

globalStyle(`${linkText} *`, {
  fontWeight: 400,
})

export const tableRowStyle = style({})

export const subTable = style({})

export const tableFootCell = style({
  fontWeight: 'bold',
})

globalStyle(`${tableRowStyle} > th, ${tableRowStyle} > td`, {
  fontSize: '16px',
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
        zIndex: theme.zIndex.above,
      },
      false: {
        opacity: 0,
        zIndex: theme.zIndex.below,
      },
    },
  },
})

globalStyle(`${subTable} thead tr th , ${subTable} tbody tr td`, {
  border: 'none',
  backgroundColor: theme.color.blue100,
})
