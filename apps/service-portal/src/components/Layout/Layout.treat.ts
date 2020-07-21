import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const mainWrapper = style({
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
})

export const mainContainer = style({
  maxWidth: theme.contentWidth.large,
})

export const sidebar = style({
  flex: `0 0 336px`,
})
