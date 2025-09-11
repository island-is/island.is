import { globalStyle } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
const { color, typography, border } = theme

export const makeGlobal = (wrapper: string): typeof globalStyle => {
  const wrapPrefix = ' ' + wrapper + ' '
  return (selector, styles) => {
    selector =
      wrapPrefix +
      selector
        .trim()
        .split(/\s*,\s*/)
        .filter((x) => x) // tolerate extra commas
        .join(',' + wrapPrefix)
    globalStyle(selector, styles)
  }
}

// ---------------------------------------------------------------------------

export const diffStyling = (wrapper: string) => {
  const global = makeGlobal(wrapper)
  global('ins', {
    padding: `0 0.125em`,
    textDecorationColor: 'none',
    backgroundColor: color.mint200,
  })
  global('del', {
    padding: `0 0.125em`,
    textDecorationColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: color.red200,
  })
}

// ---------------------------------------------------------------------------

export const regulationTitleStyling = (wrapper: string) => {
  const styleTitle = makeGlobal(wrapper)

  styleTitle('', {
    '@media': {
      print: {
        fontFamily: '"Times New Roman", "Times", serif',
        fontSize: '1.667em',
      },
    },
  })
}

// ---------------------------------------------------------------------------

export const regulationContentStyling = (wrapper: string) => {
  const styleRegulation = makeGlobal(wrapper)

  styleRegulation('', {
    lineHeight: typography.baseLineHeight + 'em',

    '@media': {
      // FIXME: Tweak styling of Appendixes and Comments accordions
      print: {
        lineHeight: '1.3em',
        fontFamily: '"Times New Roman", "Times", serif',
        fontSize: '11pt',
      },
    },
  })

  styleRegulation(' *', {
    position: 'relative', // Silly hack to enable page-break-* rules. See: https://stackoverflow.com/a/12386608
    fontWeight: typography.light,

    '@media': {
      print: {
        fontFamily: 'inherit',
      },
    },
  })

  styleRegulation('.indented', {
    position: 'relative',
    marginLeft: '2em',
  })

  styleRegulation('p,ul,ol,pre,table,blockquote', {
    fontFamily: 'inherit',
    marginBottom: typography.baseLineHeight + 'em',
    '@media': { print: { marginBottom: '.5em' } },
  })

  styleRegulation('a', {
    color: theme.color.blue400,
  })

  styleRegulation(
    `
    li > p,
    li > ul,
    li > ol,
    li > table,
    li > blockquote,
    li > pre
    `,
    {
      marginBottom: '1em',
      '@media': { print: { marginBottom: '.5em' } },
    },
  )

  styleRegulation('li', {
    marginBottom: '0.5em',
    '@media': { print: { marginBottom: '.5em' } },
  })

  styleRegulation(
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

  styleRegulation('hr', {
    marginTop: 0,
    marginBottom: typography.baseLineHeight + 'em',

    '@media': { print: { margin: '0 0 .5em 0' } },
  })

  styleRegulation('ul,ol,blockquote', {
    marginLeft: '2em',
    // '@media': { print: { marginBottom: '2em' } },
  })
  styleRegulation('ul', {
    listStyle: 'disc',
  })
  styleRegulation('ul[type="circle"]', {
    listStyle: 'circle',
  })
  styleRegulation('ul[type="square"]', {
    listStyle: 'square',
  })
  styleRegulation('ol:not([type])', {
    listStyle: 'decimal',
  })

  styleRegulation('strong, b', {
    fontWeight: typography.semiBold,
  })
  styleRegulation('em, i', {
    fontStyle: 'italic',
  })

  styleRegulation('sub, sup', {
    verticalAlign: 'baseline',
    fontSize: 14 / 18 + 'em',
    position: 'relative',
    lineHeight: 0,
    top: '-0.4em',
  })
  styleRegulation('sub', {
    top: '0.333em',
  })
  styleRegulation('u', {
    textDecoration: 'underline',
  })
  styleRegulation('s', {
    textDecoration: 'overline',
  })
  styleRegulation('s u, u s', {
    textDecoration: 'underline overline',
  })

  styleRegulation('img', {
    display: 'inline',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
  })

  styleRegulation('table', {
    borderCollapse: 'separate',
    borderSpacing: 0,

    '@media': { print: { marginBottom: '1em', width: '100%' } },
  })

  styleRegulation('table:not([width])', {
    width: '100%',
  })

  styleRegulation('th, td', {
    padding: '0.25em 0.33em',
    minWidth: '1.5em',
    textAlign: 'left',
    verticalAlign: 'top',
    width: 'auto',
    border: `1px solid ${color.dark300}`,

    '@media': {
      print: {
        pageBreakInside: 'avoid',
      },
    },
  })
  styleRegulation(
    `
    tr:not(:first-child) > th,
    tr:not(:first-child) > td
    `,
    {
      borderTop: '0',
    },
  )
  styleRegulation(
    `
    tr > th:not(:first-child),
    tr > td:not(:first-child)
    `,
    {
      borderLeft: '0',
    },
  )

  styleRegulation(
    `
    .layout > * > * > th,
    .layout > * > * > td,
    `,
    {
      border: 0,
    },
  )

  styleRegulation(`th`, {
    fontWeight: 'bold',
    backgroundColor: color.dark100,
  })

  styleRegulation('thead > tr:last-child > th', {
    borderBottomWidth: border.width.large,
  })
  styleRegulation(
    `
    tfoot > tr:first-child> td,
    tfoot > tr:first-child> th
    `,
    {
      borderTop: `1px solid ${color.dark300}`,
    },
  )

  styleRegulation('[align="right"]', {
    textAlign: 'right',
  })
  styleRegulation('[align="center"]', {
    textAlign: 'center',
  })

  styleRegulation('h1,h2,h3,h4,h5,h6', {
    fontWeight: typography.headingsFontWeight,
    '@media': {
      print: {
        pageBreakAfter: 'avoid',
        pageBreakInside: 'avoid',
        marginBottom: '.5rem',
      },
    },
  })

  styleRegulation('h1, h2,', {
    // color: 'red',
    marginTop: '2em',
    fontSize: '1.2em',
    fontWeight: typography.headingsFontWeight,
  })
  styleRegulation('h3', {
    marginTop: '1.5em',
    fontWeight: typography.headingsFontWeight,
    fontSize: '1.1em',
  })
  styleRegulation('h4', {
    // color: 'red',
    fontSize: '1em',
    fontWeight: typography.headingsFontWeight,
  })
  styleRegulation('h5, h6', {
    // color: 'red',
    fontSize: '.9em',
    fontWeight: typography.headingsFontWeight,
  })

  styleRegulation('.section__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    textTransform: 'uppercase',
    lineHeight: '2em',
    '@media': { print: { lineHeight: 'inherit' } },
  })
  styleRegulation('.section__title:first-child', {
    marginTop: '0',
  })
  styleRegulation('.section__name', {
    display: 'block',
    fontStyle: 'inherit',
  })

  styleRegulation('.chapter__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    lineHeight: '2em',
    '@media': { print: { lineHeight: 'inherit' } },
  })
  styleRegulation(
    `
    .chapter__title:first-child,
    .section__title + .chapter__title
    `,
    {
      marginTop: '0',
    },
  )
  styleRegulation('.chapter__name', {
    display: 'block',
    fontStyle: 'inherit',
    fontWeight: typography.headingsFontWeight,
  })

  styleRegulation('.subchapter__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    lineHeight: '2em',
    '@media': { print: { lineHeight: 'inherit' } },
  })
  styleRegulation(
    `
    .subchapter__title:first-child,
    .section__title + .subchapter__title,
    .chapter__title + .subchapter__title
    `,
    {
      marginTop: '0',
    },
  )
  styleRegulation('.subchapter__name', {
    display: 'block',
    fontStyle: 'inherit',
    fontWeight: typography.headingsFontWeight,
  })

  styleRegulation('.article__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    marginBottom: '1.5em',
    lineHeight: '2em',
    '@media': { print: { marginBottom: '.5em', lineHeight: 'inherit' } },
  })
  styleRegulation('.article__title--provisional', {
    fontWeight: typography.headingsFontWeight,
  })
  styleRegulation(
    `
    .article__title:first-child,
    .section__title + .article__title,
    .chapter__title + .article__title,
    .subchapter__title + .article__title
    `,
    {
      marginTop: '0',
    },
  )
  styleRegulation('.article__name', {
    display: 'block',
    fontStyle: 'italic',
  })

  return styleRegulation
}
