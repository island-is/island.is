import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const leftWidth = 180

export const breakdownRowContainer = style({
  display: 'grid',
  gridTemplateColumns: `${leftWidth}px 1fr`,
  gap: theme.spacing[5],
})

export const stayOnSinglePageWhenPrinting = style({
  pageBreakInside: 'avoid',
})
