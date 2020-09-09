import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({})

globalStyle(
  [
    `${container} p`,
    `${container} h2`,
    `${container} h3`,
    `${container} h4`,
    `${container} h5`,
  ].join(','),
  {
    margin: `${theme.spacing[2]}px 0`,
  },
)

globalStyle(`${container} *:first-child`, {
  marginTop: 0,
})

globalStyle(`${container} *:last-child`, {
  marginBottom: 0,
})

globalStyle(`${container} ul`, {
  listStyle: 'none',
})

globalStyle(`${container} ul li`, {
  position: 'relative',
  paddingLeft: 24,
})

globalStyle(`${container} ul li:before`, {
  content: '""',
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
  borderRadius: '50%',
  border: `4px solid red`,
})

globalStyle(`${container} ol`, {
  listStyle: 'decimal',
  fontFamily: 'inherit',
  marginLeft: '24px',
})

globalStyle(`${container} ol li`, {
  fontFamily: 'inherit',
})
