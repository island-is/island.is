import { style, globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const line = style({
  width: 1,
  height: theme.spacing[3],
  background: theme.color.dark200,
})

export const animatedContent = style({
  paddingTop: theme.spacing[1],
})

export const categoryContainer = style({
  width: 120,
})

export const content = style({
  wordBreak: 'break-word',
})

const listStyle = {
  fontWeight: theme.typography.light,
  listStyle: 'auto',
  paddingLeft: theme.spacing[3],
  paddingTop: theme.spacing[2],
  lineHeight: theme.typography.baseLineHeight,
}
const textStyle = {
  fontWeight: theme.typography.light,
  lineHeight: theme.typography.baseLineHeight,
}

export const text = style({})

globalStyle(`${text} ol`, listStyle)
globalStyle(`${text} p`, textStyle)
