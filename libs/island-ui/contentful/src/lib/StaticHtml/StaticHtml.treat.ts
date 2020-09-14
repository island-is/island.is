import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({})

globalStyle(`${container} > *`, {
  margin: `${theme.spacing[3]}px 0`,
})

globalStyle([1, 2, 3, 4, 5, 6].map((i) => `${container} h${i}`).join(', '), {
  marginTop: theme.spacing[5],
})

globalStyle(`${container} > *:first-child`, {
  marginTop: 0,
})

globalStyle(`${container} > *:last-child`, {
  marginBottom: 0,
})

globalStyle(`${container} ul`, {
  listStyle: 'none',
})

globalStyle(`${container} ul li`, {
  position: 'relative',
  paddingLeft: theme.spacing[3],
  paddingBottom: theme.spacing[1],
})

globalStyle(`${container} ul li:before`, {
  content: '""',
  position: 'absolute',
  top: '10px',
  left: 0,
  borderRadius: '50%',
  border: `4px solid red`,
})

globalStyle(`${container} ol`, {
  listStyle: 'decimal',
  marginLeft: theme.spacing[3],
})
