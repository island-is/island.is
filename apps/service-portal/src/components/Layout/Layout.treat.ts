import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const mainWrapper = style({
  display: 'flex',
  position: 'relative',
})

export const mainContainer = style({
  width: '100%',
  maxWidth: theme.contentWidth.medium,
})

export const sidebar = style({
  flex: `0 0 336px`,
})
