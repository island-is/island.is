import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

// Matches island-ui Link's "small" underline (inset box-shadow) and the
// text-button focus treatment, while inheriting font from the surrounding
// text so the link sits inline in a sentence at the same size and weight.
export const inlineLink = style({
  display: 'inline',
  padding: 0,
  paddingBottom: 1,
  border: 'none',
  background: 'none',
  font: 'inherit',
  color: theme.color.blue400,
  textDecoration: 'none',
  boxShadow: 'inset 0 -1px 0 0 currentColor',
  transition: 'color .2s, box-shadow .2s',
  cursor: 'pointer',
  ':hover': {
    color: theme.color.blueberry400,
  },
  ':focus-visible': {
    outline: 'none',
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
})
