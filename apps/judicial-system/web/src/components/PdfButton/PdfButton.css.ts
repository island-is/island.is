import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const pdfRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  minHeight: `${theme.spacing[10]}px`,
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue200}`,
  padding: theme.spacing[2],
})

export const cursor = style({ cursor: 'pointer' })

export const disabled = style({
  cursor: 'not-allowed',
  backgroundColor: theme.color.dark100,
  opacity: 0.5,
})

export const fileNameContainerWithChildren = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      flexBasis: '70%',
    },
  },
})

export const fileNameContainer = style({
  marginRight: theme.spacing[2],
  wordBreak: 'break-all',
})
