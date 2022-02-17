import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
const { border, spacing } = theme

export const explainerText = style({})

export const cancelModal = style({
  backgroundColor: 'white',
  minHeight: '50vh',
  width: 500,
  minWidth: '50vw',
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

export const changeModal = style({})
