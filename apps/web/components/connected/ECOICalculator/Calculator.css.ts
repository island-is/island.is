import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const tableContainer = style({
  border: `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`,
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',
})

export const tableRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: theme.spacing[3],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
})

export const stayOnSinglePageWhenPrinting = style({
  pageBreakInside: 'avoid',
})
