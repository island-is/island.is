import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

import { HEADER_HEIGHT_LG } from '../../constants'

export const layoutWrapper = style({
  background: theme.color.blue100,
  minHeight: `calc(100vh - ${HEADER_HEIGHT_LG}px)`,
})

export const mainWrapper = style({
  width: '100%',
  maxWidth: theme.contentWidth.large,
})
