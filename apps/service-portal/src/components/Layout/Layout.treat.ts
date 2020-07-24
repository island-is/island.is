import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

// TODO: Use actual header height
export const layoutWrapper = style({
  minHeight: 'calc(100vh - 80px)',
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: theme.contentWidth.large,
})
