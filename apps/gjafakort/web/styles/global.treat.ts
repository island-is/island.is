import { globalStyle } from 'treat'

globalStyle('html', {
  boxSizing: 'border-box',
  fontSize: '16px',
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
  fontFamily: '"IBM Plex Sans", sans-serif',
  color: '#00003c',
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
  // '-webkit-appearance': 'none',
  // '-moz-appearance': 'none',
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
