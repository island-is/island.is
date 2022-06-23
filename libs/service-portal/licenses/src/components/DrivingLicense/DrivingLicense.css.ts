import { globalStyle, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const image = style({
  width: 60,
  height: 60,
  marginRight: theme.spacing[3],
})

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})

export const flexGrow = style({
  flex: 1,
  '@media': {
    [`screen and (min-width: 1200px)`]: {
      flex: 'none',
    },
  },
})

export const flexShrink = style({
  flex: 0,
  '@media': {
    [`screen and (min-width: 1200px)`]: {
      flex: 'none',
    },
  },
})
