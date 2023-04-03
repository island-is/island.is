import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const logo = style({
  marginRight: theme.spacing[2],
  width: theme.spacing[3],
  height: theme.spacing[3],
  objectFit: 'contain',
})

export const focusableTableRow = style({
  transition: 'box-shadow 150ms ease-in-out, background 150ms ease-in-out',
  cursor: 'pointer',

  ':hover': {
    background: theme.color.blue100,
  },

  selectors: {
    [`&:focus`]: {
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
      outline: 'none',
    },
  },
})

globalStyle(`${focusableTableRow}:focus > *`, { borderColor: 'transparent' })
