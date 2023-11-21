import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const CaseFileContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: '100%',
})

export const CaseFileNameContainer = style({
  display: 'flex',
  flex: '1',
  alignItems: 'center',
  marginRight: theme.spacing[1],
  maxWidth: '68%',
})

export const CaseFileName = style({
  marginRight: theme.spacing[1],
  maxWidth: '80%',
})

export const CaseFileCreatedContainer = style({
  marginRight: theme.spacing[2],
  whiteSpace: 'nowrap',
})
