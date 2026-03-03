import { globalStyle, style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  height: 260,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
})

export const purpleTags = style({})

globalStyle(`${purpleTags} a:hover, ${purpleTags} button:hover`, {
  backgroundColor: theme.color.purple400,
  color: theme.color.white,
})

export const image = style({
  width: 100,
  height: 'auto',
  maxWidth: 100,
  maxHeight: 100,
  marginTop: 10,
  ...themeUtils.responsiveStyle({
    xl: {
      width: 120,
      maxWidth: 120,
      maxHeight: 120,
      marginRight: 20,
    },
  }),
})
