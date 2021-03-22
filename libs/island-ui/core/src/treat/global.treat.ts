import { globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'

globalStyle('html', {
  boxSizing: 'border-box',
  fontSize: theme.typography.baseFontSize,
})

globalStyle('body', {
  overflowX: 'hidden',
})

globalStyle('*, *:before, *:after', {
  boxSizing: 'inherit',
})

globalStyle('body, h1, h2, h3, h4, h5, h6, p, ol, ul, blockquote', {
  margin: 0,
  padding: 0,
  fontWeight: 'normal',
  fontFamily: theme.typography.fontFamily,
  color: theme.color.dark400,
  scrollMarginTop: 64,
})

globalStyle('strong', {
  fontWeight: theme.typography.semiBold,
})

// NOTE: DO NOT reset `ol[type]` <-- !!!!!
// Since CSS attribute selectors for most standard HTML attributes
// are case-insensitive it becomes impossible to reapply the
// default styles for `<ol type="A">` and `<ol type="a">`
// ...and `<ol type="I">` and `<ol type="i">`
// This is important because the ol[type] attribute is semantic,
// not presentational, as text content may use wording such as
// "see item C below" or "according to item viii above"
globalStyle('ol:not([type]), ul', {
  listStyle: 'none',
})

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
})

globalStyle('a:hover', {
  textDecoration: 'underline',
})

globalStyle('img', {
  maxWidth: '100%',
  height: 'auto',
})

globalStyle('button, input, optgroup, select, textarea', {
  margin: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  color: 'inherit',
  lineHeight: 'inherit',
})

globalStyle('button', {
  display: 'inline-block',
  border: 'none',
  background: 'transparent',
  padding: 0,
  margin: 0,
  textDecoration: 'none',
  fontSize: 'inherit',
  lineHeight: 1,
  cursor: 'pointer',
  textAlign: 'center',
  appearance: 'none',
})

globalStyle('.visually-hidden', {
  position: 'absolute',
  height: '1px',
  width: '1px',
  overflow: 'hidden',
  clip: 'rect(1px, 1px, 1px, 1px)',
  whiteSpace: 'nowrap',
})

globalStyle('.js-focus-visible :focus:not(.focus-visible)', {
  outline: 'none',
})
