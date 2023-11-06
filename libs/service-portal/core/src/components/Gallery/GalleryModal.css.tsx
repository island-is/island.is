import { theme, themeUtils, white } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  position: 'relative',
  margin: theme.spacing.smallGutter,
  borderRadius: theme.border.radius.large,
  overflow: 'auto',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
      height: 515,
      width: 570,
    },
  }),
})

export const container = style({
  height: '100%',
  width: '100%',
  display: 'grid',
  rowGap: '5px',
  backgroundColor: white,
})
