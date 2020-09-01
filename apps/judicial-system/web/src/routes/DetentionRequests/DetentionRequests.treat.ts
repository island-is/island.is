import { style } from 'treat'

export const detentionRequestsContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(3, auto)',
  margin: '64px 48px 0',
})

export const logoContainer = style({
  gridColumn: '1 / -1',
  marginBottom: 32,
})

export const addDetentionRequestButtonContainer = style({
  gridRow: '2',
  gridColumn: '1 / 13',
  justifySelf: 'end',
  marginBottom: 64,
})

export const detentionRequestsTable = style({
  gridRow: '3',
  gridColumn: '1 / -1',
})
