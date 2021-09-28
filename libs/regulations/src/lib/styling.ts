import { globalStyle } from 'treat'
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
        fontSize: '20pt',
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
      print: {
        lineHeight: '1.2em',
        fontFamily: '"Times New Roman", "Times", serif',
        fontSize: '12pt',
      },
    },
  })

  styleRegulation(' *', {
    fontWeight: typography.light,

    '@media': {
      print: {
        fontFamily: 'inherit',
      },
    },
  })

  styleRegulation('p,ul,ol,table,blockquote', {
    fontFamily: 'inherit',
    marginBottom: typography.baseLineHeight + 'em',

    '@media': { print: { marginBottom: '1em' } },
  })
  styleRegulation('li', {
    marginBottom: '1em',

    '@media': { print: { marginBottom: '.5em' } },
  })
  styleRegulation(
    `
    li,
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
  styleRegulation('ul,ol,blockquote', {
    marginLeft: '3em',
    '@media': { print: { marginBottom: '2em' } },
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
    top: '-0.333em',
  })
  styleRegulation('sub', {
    top: 'auto',
    bottom: '-0.333em',
  })

  styleRegulation('img', {
    display: 'inline',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
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

  styleRegulation('table', {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
  })

  styleRegulation('th, td', {
    padding: '0.25em 0.5em',
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
      borderTop: '1px solid',
      borderTopColor: color.dark300,
    },
  )

  styleRegulation('ol:not([type])', {
    listStyle: 'decimal',
  })

  styleRegulation('[align="right"]', {
    textAlign: 'right',
  })
  styleRegulation('[align="center"]', {
    textAlign: 'center',
  })

  styleRegulation('h1,h2,h3,h4,h5,h6', {
    '@media': {
      print: {
        pageBreakAfter: 'avoid',
        pageBreakInside: 'avoid',
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
  styleRegulation('em.section__name', {
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
  styleRegulation('em.chapter__name', {
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
    '@media': { print: { marginBottom: '1em', lineHeight: 'inherit' } },
  })
  styleRegulation('.article__title--provisional', {
    fontWeight: typography.headingsFontWeight,
  })
  styleRegulation(
    `
    .article__title:first-child,
    .section__title + .chapter__title,
    .chapter__title + .article__title
    `,
    {
      marginTop: '0',
    },
  )
  styleRegulation('em.article__name', {
    display: 'block',
    fontStyle: 'italic',
  })

  return styleRegulation
}
