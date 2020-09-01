import { style } from 'treat'

export const detentionRequestContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(3, auto)',
  margin: '64px 48px 0',
})

export const logoContainer = style({
  gridColumn: '1 / span 3',
})

export const titleContainer = style({
  gridColumn: '5 / -1',
})

export const detentionRequestsTable = style({
  gridRow: '3',
  gridColumn: '1 / -1',
})
