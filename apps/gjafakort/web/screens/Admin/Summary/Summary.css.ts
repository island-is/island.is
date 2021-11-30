import { style, globalStyle } from '@vanilla-extract/css'

export const table = style({
  textAlign: 'left',
  width: '100%',
  borderCollapse: 'collapse',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  overflow: 'hidden',
  borderRadius: '4px', // theme.border.radius.standard,
})

export const thead = style({
  color: '#0044b3', // theme.color.blue600,
  height: '32px', // theme.spacing['4'],
  borderBottom: '1px solid #f2f7ff', // `${theme.border.width.standard} solid ${theme.color.blue100}`,
})

globalStyle(`${thead} tr th`, {
  padding: '16px', // theme.spacing['2'],
  color: '#f2f7ff', // theme.color.blue100,
  background: '#0044b3', // theme.color.blue600,
  border: 'none',
  fontVariant: 'small-caps',
  textTransform: 'lowercase',
  letterSpacing: '0.05em',
})

export const tr = style({
  borderBottom: '1px solid #ccccd8', // `${theme.border.width.standard} solid ${theme.color.dark200}`,
})

globalStyle(`${tr} td`, {
  padding: '16px', // theme.spacing['2'],
  borderBottom: '1px solid #f2f7ff', // `${theme.border.width.standard} solid ${theme.color.dark100}`,
})

export const right = style({
  textAlign: 'right',
})

export const breakText = style({
  wordBreak: 'break-all',
})
