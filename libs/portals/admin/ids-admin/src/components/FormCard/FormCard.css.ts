import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const accordionWrapper = style({
  borderTop: `${theme.border.style.solid} ${theme.border.width.standard}px ${theme.border.color.standard}`,
})
