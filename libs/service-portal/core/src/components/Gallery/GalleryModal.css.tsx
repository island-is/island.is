import { theme, themeUtils, white } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: `calc(100% - ${theme.spacing['6']}px)`,
  maxHeight: `calc(100% - ${theme.spacing['6']}px)`,
  margin: theme.spacing['3'],
  borderRadius: theme.border.radius.large,
  overflowY: 'auto',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
      maxHeight: `calc(100% - ${theme.spacing['12']}px)`,
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
  zIndex: 2,
})

export const container = style({
  height: '100%',
  width: '100%',
  display: 'grid',
  rowGap: '5px',
  backgroundColor: white,
})
