import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const spanStyle = style({})

globalStyle(`${spanStyle} > div > ol`, {
  listStyle: 'unset',
  listStyleType: 'decimal',
  color: theme.color.dark400,
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
  marginBottom: 10,
  paddingLeft: 40,
})

globalStyle(`${spanStyle} > div > ul`, {
  listStyle: 'unset',
  color: theme.color.dark400,
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
  marginBottom: 10,
  paddingLeft: 40,
})

globalStyle(`${spanStyle} > div > h4`, {
  marginTop: 10,
  marginBottom: 10,
  fontSize: '20px',
  lineHeight: 1.5,
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
})

globalStyle(`${spanStyle} > div > p > a`, {
  color: theme.color.blue400,
})
globalStyle(`${spanStyle} > div > p`, {
  color: theme.color.dark400,
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
  marginBottom: 10,
})
