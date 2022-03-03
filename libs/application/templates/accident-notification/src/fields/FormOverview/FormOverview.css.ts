import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const formValueBreakWord = style({
  wordBreak: 'break-word',
})

export const paddingLeftForFileNames = style({
  paddingLeft: 4,
})

export const boldFileNames = style({
  fontWeight: theme.typography.semiBold,
})

export const valueLabel = style({
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
})
