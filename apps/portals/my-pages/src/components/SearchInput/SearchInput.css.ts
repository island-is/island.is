import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const wrapper = style({
  width: '100%',
})

export const searchButton = style({})

export const item = style({
  display: 'block',
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
})

export const blueBackground = style({
  background: theme.color.blue100,
})
export const whiteBackground = style({
  background: theme.color.white,
})

export const bullet = style({
  height: 4,
  width: 4,
  margin: `0 5px`,
})

export const active = style({})

export const breadcrumb = style({
  position: 'relative',
  width: 'auto',
})

globalStyle(`${searchButton}:focus > span`, {
  color: theme.color.dark400,
  backgroundColor: theme.color.mint400,
})

globalStyle(`${searchButton}:focus`, {
  outline: 0,
  boxShadow: 'none',
})

globalStyle(`${active}:hover ${breadcrumb} p`, {
  color: theme.color.blue600,
})

globalStyle(`${breadcrumb}:last-of-type p::after`, {
  visibility: 'hidden',
  content: '',
  display: 'block',
  position: 'absolute',
  backgroundColor: theme.color.blue600,
  height: '1px',
  width: 0,
  bottom: -2,
  transition: `width 0.3s, height 0.3s`,
})

globalStyle(`${active} ${breadcrumb}:last-of-type p::after`, {
  width: '100%',
  height: '1.2px',
  visibility: 'visible',
})
