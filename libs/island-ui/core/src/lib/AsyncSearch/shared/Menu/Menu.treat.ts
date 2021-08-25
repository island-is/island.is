import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const menu = style({
  padding: 0,
  margin: 0,
  width: '100%',
  position: 'absolute',
  backgroundColor: theme.color.mint300,
  border: '2px solid blue',
  maxHeight: 455,
  overflowY: 'auto',
  outline: 0,
  opacity: 0,
  borderColor: theme.color.mint400,
  borderWidth: 3,
  borderStyle: 'solid',
  borderTopWidth: 0,
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
  selectors: {
    [`&::-webkit-scrollbar`]: {
      width: 8,
      background: theme.color.white,
    },
    [`&::-webkit-scrollbar-track`]: {
      width: 8,
      background: theme.color.blue300,
      borderRadius: theme.border.radius.standard,
    },
    // [`&::-webkit-scrollbar-thumb`]: {},
    [`&::-webkit-scrollbar-thumb:hover`]: {
      background: 'red',
      color: 'red',
    },
  },
})

export const open = style({
  zIndex: 10,
  opacity: 1,
})

export const hidden = style({
  visibility: 'hidden',
})
