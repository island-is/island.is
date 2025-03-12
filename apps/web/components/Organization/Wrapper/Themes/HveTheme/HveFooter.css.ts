import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const container = style({})

export const mainColumn = style({
  paddingTop: '30px',
  paddingBottom: '24px',
})

export const firstRow = style({
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'row nowrap',
  gap: '12px',
})

export const line = style({
  borderTop: `1px solid ${theme.color.dark400}`,
  paddingBottom: '16px',
  marginTop: '16px',
  paddingTop: '48px',
})

export const locationBox = style({
  minHeight: '100px',
})
