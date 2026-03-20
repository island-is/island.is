import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const mediumBoxShadow = `inset 0 -2px 0 0 currentColor`
const smallBoxShadow = `inset 0 -1px 0 0 currentColor`
const activeBoxShadow = `inset 0 -2px 0 0 ${theme.color.mint400}`

const linkStyle = {
  color: theme.color.blue400,
  fontWeight: theme.typography.light,
  paddingBottom: 4,
  textDecoration: 'none',
  boxShadow: smallBoxShadow,
  transition: 'color .2s, box-shadow .2s',
}

const linkHoverStyle = {
  color: theme.color.blueberry600,
  boxShadow: mediumBoxShadow,
}

const linkFocusStyle = {
  color: theme.color.dark400,
  boxShadow: smallBoxShadow,
  background: theme.color.mint400,
}

const linkActiveStyle = {
  color: theme.color.blueberry600,
  boxShadow: activeBoxShadow,
}

// Creates an empty container to target
export const paragraphContainer = style({})
// We need both global styles inside the paragraphContainer and a specific link
// style for standalone links or links within other elements than <p>
globalStyle(`${paragraphContainer} a`, linkStyle)
globalStyle(`${paragraphContainer} a:hover`, linkHoverStyle)
globalStyle(`${paragraphContainer} a:focus`, linkFocusStyle)
globalStyle(`${paragraphContainer} a:active`, linkActiveStyle)

export const link = style({
  ...linkStyle,
  ':hover': linkHoverStyle,
  ':focus': linkFocusStyle,
  ':active': linkActiveStyle,
})
