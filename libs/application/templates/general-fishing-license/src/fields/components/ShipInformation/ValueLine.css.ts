import { theme } from '@island.is/island-ui/theme'
import { styleVariants } from '@vanilla-extract/css'

export const colorVariant = styleVariants({
  black: { color: theme.color.dark400 },
  green: { color: theme.color.mint600 },
  red: { color: theme.color.red400 },
  grey: { color: theme.color.dark300 },
})
