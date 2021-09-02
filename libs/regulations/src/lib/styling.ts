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

export const regulationContentStyling = (wrapper: string) => {
  const global = makeGlobal(wrapper)

  global('', {
    lineHeight: typography.baseLineHeight + 'rem',
  })

  global('p,ul,ol,table,blockquote', {
    marginBottom: typography.baseLineHeight + 'rem',
  })
  global('li', {
    marginBottom: '1rem',
  })
  global(
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
      marginBottom: '1rem',
    },
  )
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

  global('strong, b', {
    fontWeight: typography.semiBold,
  })
  global('em, i', {
    fontStyle: 'italic',
  })

  global('sub, sup', {
    verticalAlign: 'baseline',
    fontSize: 14 / 18 + 'em',
    position: 'relative',
    lineHeight: 0,
    top: '-0.333em',
  })
  global('sub', {
    top: 'auto',
    bottom: '-0.333em',
  })

  global('img', {
    display: 'inline',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
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

  global('th, td', {
    padding: '0.25em 0.5em',
    minWidth: '1.5em',
    textAlign: 'left',
    verticalAlign: 'top',
    width: 'auto',
    border: `1px solid ${color.dark300}`,
  })
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

  global(
    `
    .layout > * > * > th,
    .layout > * > * > td,
    `,
    {
      border: 0,
    },
  )

  global(`th`, {
    fontWeight: 'bold',
    backgroundColor: color.dark100,
  })

  global('thead > tr:last-child > th', {
    borderBottomWidth: border.width.large,
  })
  global(
    `
    tfoot > tr:first-child> td,
    tfoot > tr:first-child> th
    `,
    {
      borderTop: '1px solid',
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

  global('h1, h2,', {
    // color: 'red',
    marginTop: '2em',
    fontSize: '1.2em',
    fontWeight: typography.headingsFontWeight,
  })
  global('h3', {
    marginTop: '1.5em',
    fontWeight: typography.headingsFontWeight,
    fontSize: '1.1em',
  })
  global('h4', {
    // color: 'red',
    fontSize: '1em',
    fontWeight: typography.headingsFontWeight,
  })
  global('h5, h6', {
    // color: 'red',
    fontSize: '.9em',
    fontWeight: typography.headingsFontWeight,
  })

  global('.section__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    lineHeight: '2em',
    textTransform: 'uppercase',
  })
  global('.section__title:first-child', {
    marginTop: '0',
  })
  global('em.section__name', {
    display: 'block',
    fontStyle: 'inherit',
  })

  global('.chapter__title', {
    marginTop: '2em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    lineHeight: '2em',
  })
  global(
    `
    .chapter__title:first-child,
    .section__title + .chapter__title
    `,
    {
      marginTop: '0',
    },
  )
  global('em.chapter__name', {
    display: 'block',
    fontStyle: 'inherit',
    fontWeight: typography.headingsFontWeight,
  })

  global('.article__title', {
    marginTop: '2em',
    marginBottom: '1.5em',
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: typography.regular,
    lineHeight: '2em',
  })
  global(
    `
    .article__title:first-child,
    .section__title + .chapter__title,
    .chapter__title + .article__title
    `,
    {
      marginTop: '0',
    },
  )
  global('em.article__name', {
    display: 'block',
    fontStyle: 'italic',
  })

  return global
}
