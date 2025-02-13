import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const modal = style({
  position: 'absolute',
  maxWidth: `calc(100% - ${theme.spacing['6']}px)`,
  maxHeight: `calc(100% - ${theme.spacing['6']}px)`,
  borderRadius: theme.border.radius.large,
<<<<<<< HEAD
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflowY: 'auto',
=======
>>>>>>> main
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
      maxHeight: `calc(100% - ${theme.spacing['12']}px)`,
      width: '90%',
    },
    lg: {
      width: 880,
    },
  }),
})

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['1'],
  right: theme.spacing['1'],
  zIndex: 2,
})

export const image = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      marginRight: `-${theme.spacing['2']}px`,
      display: 'initial',
    },
  }),
})
