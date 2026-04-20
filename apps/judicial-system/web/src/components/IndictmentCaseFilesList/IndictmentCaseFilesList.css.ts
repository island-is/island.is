import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const electronicFileRow = style({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing[1],
  width: '100%',
  minHeight: `${theme.spacing[10]}px`,
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue200}`,
  padding: theme.spacing[2],
})

export const electronicFileLinkContainer = style({
  wordBreak: 'break-all',
})
