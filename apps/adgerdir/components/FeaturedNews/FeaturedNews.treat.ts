import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const centeredBorder = style({
  position: 'relative',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    width: 1,
    backgroundColor: theme.color.blue200,
    left: '50%',
    bottom: 0,
    opacity: 0,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      ':after': {
        opacity: 1,
      },
    },
  }),
})

export const topBorder = style({
  position: 'relative',
  borderWidth: 1,
  borderColor: theme.color.blue200,
  borderStyle: 'solid',
  paddingTop: 5,
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'block',
    },
  }),
})
