import { theme } from '@island.is/island-ui/theme'
import { style, globalStyle } from 'treat'

const mediumBoxShadow = `inset 0 -2px 0 0 currentColor`
const smallBoxShadow = `inset 0 -1px 0 0 currentColor`

export const paragraphContainer = style({})

globalStyle(`${paragraphContainer} a`, {
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
  paddingBottom: 2,
  textDecoration: 'none',
  boxShadow: smallBoxShadow,
  transition: 'color .2s, box-shadow .2s',
})

globalStyle(`${paragraphContainer} a:hover`, {
  color: theme.color.blueberry600,
  boxShadow: mediumBoxShadow,
})

export const link = style({
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
  paddingBottom: 2,
  textDecoration: 'none',
  boxShadow: smallBoxShadow,
  transition: 'color .2s, box-shadow .2s',
  ':hover': {
    color: theme.color.blueberry600,
    boxShadow: mediumBoxShadow,
  },
})
