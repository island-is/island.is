import { theme, zIndex } from '@island.is/island-ui/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const menu = style({
  minWidth: 150,
  zIndex: zIndex.aboveModal,
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
  ':focus': {
    outline: 'none',
  },
})

export const menuItem = style({
  transition: 'color .2s',
  selectors: {
    '&:not(:last-child)': {
      boxShadow: `0 1px 0 0 ${theme.color.blue100}`,
    },
    '&:hover, &:focus': {
      textDecoration: 'none',
      color: theme.color.blue400,
      outline: 'none',
    },
  },
  padding: `${theme.spacing[2]}px ${theme.spacing[1]}px`,
})

globalStyle(`${menuItem} button:focus`, {
  outline: 'none',
})
