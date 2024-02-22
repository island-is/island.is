import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const caseFileWrapper = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
  borderRadius: theme.border.radius.large,
  cursor: 'pointer',

  ':hover': {
    textDecoration: 'underline',
  },
})

export const brokenFile = style({
  cursor: 'not-allowed',

  ':hover': {
    textDecoration: 'none',
  },
})

export const caseFileName = style({
  wordBreak: 'break-all',
})
