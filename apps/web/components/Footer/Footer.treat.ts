import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const columns = style({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
})

export const column = style({
  position: 'relative',
  marginBottom: 40,
  width: '100%',
  ':last-child': {
    marginBottom: 0,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      width: '33%',
      marginBottom: 0,
    },
    xl: {
      width: '25%',
    },
  }),
})

export const columnBorder = style({
  ':after': {
    content: '""',
    display: 'none',
    position: 'absolute',
    right: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: theme.color.blue200,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      ':after': {
        display: 'inline-block',
      },
    },
  }),
})

export const columnLarge = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    lg: {
      width: '33%',
    },
    xl: {
      width: '50%',
    },
  }),
})
