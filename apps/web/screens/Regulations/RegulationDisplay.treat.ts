import { style, globalStyle } from 'treat'
import { theme } from '@island.is/island-ui/theme'
const { color, typography } = theme

export const diffToggler = style({
  float: 'right',
  color: color.blue400,
  ':hover': {
    textDecoration: 'underline',
  },
})

// ---------------------------------------------------------------------------

export const bodyText = style({
  lineHeight: 28 / 18 + 'em',
})
const B = ' ' + bodyText + ' '

globalStyle(B + 'p,ul,ol,table,blockquote'.split(',').join(',' + B), {
  marginBottom: typography.baseLineHeight + 'em',
})
globalStyle(B + 'li', {
  marginBottom: '1em',
})
globalStyle(B + 'ul,ol,blockquote'.split(',').join(',' + B), {
  marginLeft: '3em',
})
globalStyle(B + 'ul', {
  listStyle: 'disc',
})
globalStyle(B + 'ul[type="circle"]', {
  listStyle: 'circle',
})
globalStyle(B + 'ul[type="square"]', {
  listStyle: 'square',
})

globalStyle(B + 'ol:not([type])', {
  listStyle: 'decimal',
})

globalStyle(B + '[align="right"]', {
  textAlign: 'right',
})
globalStyle(B + '[align="center"]', {
  textAlign: 'center',
})

globalStyle(B + '.chapter__title', {
  textAlign: 'center',
  fontSize: '1em',
})
globalStyle(B + '.chapter__title > em', {
  display: 'block',
  fontStyle: 'inherit',
})

globalStyle(B + '.chapter__title', {
  marginTop: '2em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
globalStyle(B + '.chapter__title:first-child', { marginTop: '0' })
globalStyle(B + '.chapter__name', {
  display: 'block',
  fontStyle: 'inherit',
  fontWeight: typography.headingsFontWeight,
})

globalStyle(B + 'ins.diffins,' + B + 'ins.diffmod', {
  padding: `0 0.125em`,
  textDecorationColor: 'none',
  backgroundColor: color.mint200,
})
globalStyle(B + 'del.diffdel,' + B + 'del.diffmod', {
  padding: `0 0.125em`,
  textDecorationColor: 'rgba(0, 0, 0, 0.5)',
  backgroundColor: color.red200,
})

globalStyle(B + '.article__title', {
  marginTop: '2em',
  marginBottom: '1.5em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
globalStyle(
  B + '.article__title:first-child' + B + '.chapter__title + .article__title',
  { marginTop: '0' },
)
globalStyle(B + '.article__name', {
  display: 'block',
  fontStyle: 'italic',
})
