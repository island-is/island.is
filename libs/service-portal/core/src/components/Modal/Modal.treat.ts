import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const modal = style({
  position: 'relative',
  top: '50%',
  maxHeight: '80%',
  margin: 'auto',
  borderRadius: theme.border.radius.large,
  overflowY: 'auto',
  transform: 'translate3d(0, -50%, 0)',
  ...themeUtils.responsiveStyle({
    md: {
      width: '90%',
    },
    lg: {
      width: 828,
    },
  }),
})

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['1'],
  right: theme.spacing['1'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 44,
  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,
  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',
  ':hover': {
    backgroundColor: theme.color.dark100,
  },
  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})
