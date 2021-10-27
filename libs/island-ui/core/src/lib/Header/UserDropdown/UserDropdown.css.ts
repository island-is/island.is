import { style } from '@vanilla-extract/css'

import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'

export const dropdown = style({
  position: 'fixed',
  top: spacing[3],
  right: spacing[3],
  left: spacing[3],

  maxHeight: `calc(100vh - ${spacing[6]}px)`,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',

  ...themeUtils.responsiveStyle({
    md: {
      left: 'auto',
      right: 'auto',
      width: 'auto',
    },
  }),
})

export const closeButton = style({
  display: 'flex',
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
    backgroundColor: theme.color.dark100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

export const inner = style({
  position: 'relative',

  width: '100%',
  maxWidth: '100%',

  ...themeUtils.responsiveStyle({
    md: {
      width: 310,
    },
  }),
})
