import { globalStyle } from 'treat'
import { theme } from './'

globalStyle('html', {
  boxSizing: 'border-box',
  fontSize: theme.baseFontSize,
  scrollBehavior: 'smooth',
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
  fontFamily: theme.fontFamily,
  color: theme.baseColor,
})

globalStyle('ol, ul', {
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
