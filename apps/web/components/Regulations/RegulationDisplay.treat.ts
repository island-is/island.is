import { style, globalStyle } from 'treat'
import { theme, spacing } from '@island.is/island-ui/theme'
const { color, typography, border, shadows } = theme

export const scrolled = style({})

export const breadCrumbs = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
})

globalStyle(`${scrolled} ${breadCrumbs} nav > div:not(:last-child)`, {
  position: 'absolute',
  zIndex: -1,
  opacity: 0.000001,
})

export const statusHeader = style({
  position: 'sticky',
  top: 0,
  marginTop: -spacing[3] - 4,
  paddingTop: spacing[3] + 4,
  paddingBottom: spacing[2],
  backgroundColor: color.white,

  selectors: {
    [`${scrolled} &`]: {
      transition: 'all 600ms 50ms ease-in',
      marginLeft: -spacing[2],
      marginRight: -spacing[2],
      paddingLeft: spacing[2],
      paddingRight: spacing[2],
      borderBottom: '1px solid ' + color.dark200,
      boxShadow: '0 20px 20px -20px  rgba(28, 28, 28, .15)',
    },
  },
})

export const diffInfo = style({
  marginTop: spacing[1],
  fontSize: '.75em',
  // color: color.dark300,
  opacity: 0.67,
})

export const diffToggler = style({
  float: 'right',
  color: color.blue400,
  marginBottom: 0,

  ':hover': {
    textDecoration: 'underline',
  },
})

const makeWatermark = (text: string, size = 1, opacity = 1) => {
  const fontSize = size * 200
  opacity *= 0.0575
  return `url("data:image/svg+xml,%3Csvg viewBox='0 0 773 499' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E text %7B fill: rgba(0, 0, 0, ${opacity}); font-family: Calibri, sans-serif; font-weight: 700; font-size: ${fontSize}px; letter-spacing: -0.03em; text-anchor: middle; dominant-baseline: central; %7D %3C/style%3E%3Ctext x='50%25' y='50%25' transform='rotate(-38, 386, 250)'%3E${text}%3C/text%3E%3C/svg%3E%0A")`
}

export const repealedWarning = style({
  backgroundImage: makeWatermark('Brottfelld', 0.9),
  backgroundSize: '100% auto',
  backgroundPosition: 'top center',
})
export const oudatedWarning = style({
  backgroundImage: makeWatermark('Úrelt', 1, 0.5),
  backgroundSize: '100% auto',
  backgroundPosition: 'top center',
})
export const upcomingWarning = style({
  backgroundImage: makeWatermark('Framtíðar', 0.75),
})

// ---------------------------------------------------------------------------

export const bodyText = style({
  lineHeight: 28 / 18 + 'em',
})

const global: typeof globalStyle = (selector, styles) => {
  const B = ' ' + bodyText + ' '
  selector =
    B +
    selector
      .trim()
      .split(/\s*,\s*/)
      .filter((x) => x) // tolerate extra commas
      .join(',' + B)
  globalStyle(selector, styles)
}

global('p,ul,ol,table,blockquote', {
  marginBottom: typography.baseLineHeight + 'em',
})
global('li', {
  marginBottom: '1em',
})
global('ul,ol,blockquote', {
  marginLeft: '3em',
})
global('ul', {
  listStyle: 'disc',
})
global('ul[type="circle"]', {
  listStyle: 'circle',
})
global('ul[type="square"]', {
  listStyle: 'square',
})

global(
  `
  p:last-child,
  ul:last-child,
  ol:last-child,
  table:last-child
  `,
  {
    marginBottom: 0,
  },
)

global('table', {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
})

global('th,td', {
  padding: '0.25em 0.5em',
  minWidth: '1.5em',
  textAlign: 'left',
  verticalAlign: 'top',
  width: 'auto',
})
global(
  `
  table:not(.layout) th,
  table:not(.layout) td,
  `,
  {
    borderWidth: border.width.standard,
    borderStyle: border.style.solid,
    borderColor: color.dark300,
  },
)

global(
  `
  tr:not(:first-child) > th,
  tr:not(:first-child) > td
  `,
  {
    borderTop: '0',
  },
)
global(
  `
  tr > th:not(:first-child),
  tr > td:not(:first-child)
  `,
  {
    borderLeft: '0',
  },
)

global(`th`, {
  fontWeight: 'bold',
  backgroundColor: color.dark100,
})

global('thead tr:last-child th', {
  borderBottomWidth: border.width.large,
})
global(
  `
  tfoot tr:first-child td,
  tfoot tr:first-child th
  `,
  {
    borderTopWidth: border.width.standard,
    borderTopStyle: border.style.solid as 'solid',
    borderTopColor: color.dark300,
  },
)

global('ol:not([type])', {
  listStyle: 'decimal',
})

global('[align="right"]', {
  textAlign: 'right',
})
global('[align="center"]', {
  textAlign: 'center',
})

global('.chapter__title', {
  textAlign: 'center',
  fontSize: '1em',
})
global('.chapter__title > em', {
  display: 'block',
  fontStyle: 'inherit',
})

global('.chapter__title', {
  marginTop: '2em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
global('.chapter__title:first-child', {
  marginTop: '0',
})
global('.chapter__name', {
  display: 'block',
  fontStyle: 'inherit',
  fontWeight: typography.headingsFontWeight,
})

global(
  // 'ins.diffins, ins.diffmod',
  'ins',
  {
    padding: `0 0.125em`,
    textDecorationColor: 'none',
    backgroundColor: color.mint200,
  },
)

global(
  // 'del.diffdel, del.diffmod',
  'del',
  {
    padding: `0 0.125em`,
    textDecorationColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: color.red200,
  },
)

global('.article__title', {
  marginTop: '2em',
  marginBottom: '1.5em',
  textAlign: 'center',
  fontSize: '1em',
  lineHeight: '2em',
})
global(
  `
  .article__title:first-child,
  .chapter__title + .article__title
  `,
  {
    marginTop: '0',
  },
)
global('.article__name', {
  display: 'block',
  fontStyle: 'italic',
})
