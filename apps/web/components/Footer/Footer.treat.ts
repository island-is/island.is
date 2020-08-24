import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const columns = style({
  display: 'flex',
  ...themeUtils.responsiveStyle({
    md: {
      right: 43,
    },
  }),
})

export const column = style({
  position: 'relative',
  width: '25%',
  ':after': {
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: theme.color.blue200,
  },
})

export const columnBorder = style({
  ':after': {
    content: '""',
  },
})

export const columnLarge = style({
  width: '50%',
})
