import { spacing, theme } from '@island.is/island-ui/theme'
import { style, globalStyle } from '@vanilla-extract/css'

export const closeButton = style({
  justifyContent: 'center',
  alignItems: 'center',

  position: 'absolute',
  top: spacing[1],
  right: spacing[1],
  zIndex: 20,

  width: 44,
  height: 44,

  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,

  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',

  ':hover': {
    backgroundColor: theme.color.blue100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

globalStyle(`${closeButton}:hover > svg`, {
  color: theme.color.blue400,
})
