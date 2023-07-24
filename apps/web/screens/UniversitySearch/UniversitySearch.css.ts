import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const iconButton = style({
  margin: '0 7px',
})

export const gridContainer = style({
  padding: `0`,
})

export const filterWrapper = style({
  width: '320px',
})

export const tagActive = style({
  color: `${theme.color.white} !important`,
  backgroundColor: `${theme.color.blue400} !important`,
})

export const tagNotActive = style({
  color: `${theme.color.blue400} !important`,
  backgroundColor: `${theme.color.blue100} !important`,
  ':hover': {
    textDecoration: 'none',
    backgroundColor: `${theme.color.blue400} !important`,
    color: `${theme.color.white} !important`,
  },
})
