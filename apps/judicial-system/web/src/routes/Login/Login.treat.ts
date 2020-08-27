import { style } from 'treat'

export const loginContainer = style({
  display: 'grid',
  gridColumnGap: 24,
  gridTemplateColumns: 'repeat(12, 1fr)',
  gridTemplateRows: 'repeat(5, auto)',
  margin: '168px 48px 0',
})

export const logoContainer = style({
  gridRow: '1',
  gridColumn: '2 / -1',
  marginBottom: 72,
})

export const titleContainer = style({
  gridRow: '2',
  gridColumn: '2 / span 6',
  marginBottom: 24,
})

export const subTitleContainer = style({
  gridRow: '3',
  gridColumn: '2 / span 6',
  marginBottom: 40,
})

export const inputContainer = style({
  gridRow: '4',
  gridColumn: '2 / span 4',
  marginBottom: 40,
})

export const buttonContainer = style({
  gridRow: '5',
  gridColumn: '2 / span 2',
})
