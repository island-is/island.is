import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const link = style({
  color: theme.color.blue400,
  ':hover': {
    color: theme.color.blueberry400,
    textDecoration: 'none',
  },
  textDecoration: 'none',
  boxShadow: `inset 0 -2px 0 0 currentColor`,
  paddingBottom: 4,
  transition: 'color .2s, box-shadow .2s',
  cursor: 'pointer',
})
