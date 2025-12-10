import type { EditorClasses } from '@dmr.is/regulations-tools/Editor'
import { style, globalStyle, keyframes, StyleRule } from '@vanilla-extract/css'
import { spacing, theme } from '@island.is/island-ui/theme'
import {
  diffStyling,
  regulationContentStyling,
} from '@island.is/regulations/styling'
import {
  hasFocus,
  containerDisabled,
  isImpact,
  readOnly,
} from './EditorInput.css'
import { recipe } from '@vanilla-extract/recipes'

const { color, typography, border } = theme

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

export const editorWrapper = recipe({
  base: {
    position: 'relative',
    zIndex: 0,
    boxShadow: `0 0 0 1px ${theme.color.blue200}`,
    borderRadius: theme.border.radius.large,
    selectors: {
      '&:focus-within': {
        zIndex: 1,
      },
    },
  },
  variants: {
    error: {
      true: {
        boxShadow: `0 0 0 1px ${theme.color.red600}`,
      },
    },
  },
})

export const errorStyle = style({
  color: theme.color.red600,
  fontWeight: 500,
  fontSize: 14,
  marginTop: theme.spacing[1],
})

const addLegened = (
  $legend?: string | { value: string },
  $tiny?: boolean,
  $warning?: boolean,
): StyleRule => {
  let color = '#555'
  let backgroundColor = '#dde9cc'

  if ($warning) {
    color = '#700'
    backgroundColor = '#ddcccc'
  }

  const fontSize = $tiny ? '0.5rem' : '0.67rem'

  const content = !$legend
    ? undefined
    : typeof $legend === 'string'
    ? `"${$legend}"`
    : $legend.value

  return {
    position: 'absolute',
    top: '-0.17rem',
    right: '-0.33em', // <-- intentional `em`

    padding: '0 0.33em', // <-- intentional `em`

    pointerEvents: 'none',

    fontSize,
    lineHeight: 1.1,
    fontWeight: 'normal',

    color,
    backgroundColor,
    content,
  }
}

const addWarning = ($legend: Parameters<typeof addLegened>[0]) =>
  addLegened($legend, false, true)

// ===========================================================================

const wrapper = style({
  position: 'relative',
  zIndex: 0,
  display: 'flex',
  flexFlow: 'row nowrap',
})

export const classes: EditorClasses = {
  wrapper,

  editingpane: style({
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
  }),

  editorBooting: style({
    height: '10em',
  }),

  toolbar: style({
    position: 'sticky',
    top: 0,
    zIndex: 1,
    margin: 0,
    borderTopLeftRadius: 8,
    padding: 0,
    boxShadow: '0 3px 9px 0px rgba(0,0,0, 0.18)',

    selectors: {
      [`.${readOnly} &`]: {
        display: 'none',
      },

      [`${containerDisabled} &`]: {
        display: 'none',
      },

      [`${isImpact} &`]: {
        top: 0,
      },
    },
  }),

  editor: style({
    position: 'relative',
    minHeight: 100,
    maxHeight: 'calc(100vh - 10rem)',
    width: '100%',
    caretColor: theme.color.blue400,
    padding: spacing[3],
    paddingTop: spacing[2],
    overflowY: 'auto',
    ':focus': {
      outline: 'none',
    },
    selectors: {
      [`${containerDisabled} &`]: {
        cursor: 'default',
      },
    },
  }),

  comparisonpane: style({
    display: 'flex',
    flexFlow: 'column',
    position: 'absolute',
    zIndex: 999,
    width: '100%',
    transform: 'translateX(calc(50vw - 10%))',
    left: '50%',
    backgroundColor: theme.color.white,
    overflow: 'hidden',
    borderRadius: theme.border.radius.standard,
    border: `1px solid ${theme.color.blue200}`,
    transition: 'all 300ms 200ms ease-in-out',
    transitionProperty: 'transform',
    boxShadow: '0 0 5rem transparent',
    opacity: 0,

    selectors: {
      '&:hover': {
        boxShadow: '0 0 5rem rgba(0, 0, 0, .15)', // give this a try for mo' better contrast
        transform: 'translateX(calc(50vw - 105%))',
      },
      [`${wrapper}:hover &`]: {
        opacity: 1,
      },
      [`${hasFocus} &`]: {
        opacity: 1,
      },
    },
  }),

  comparisonpaneContainer: style({
    padding: theme.spacing[3],
    paddingTop: theme.spacing[2],
    pointerEvents: 'none',
  }),

  // comparison pane headline
  headline: style({
    pointerEvents: 'auto',
    marginLeft: 'auto',
    position: 'sticky',
    top: 0,
    zIndex: 10,

    padding: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],

    border: '1px solid',
    borderColor: theme.border.color.standard,

    fontWeight: typography.semiBold,
    lineHeight: '1.4rem',

    backgroundColor: color.white,
    boxShadow: '0 5px 10px 5px rgba(0,0,0, 0.25)',
  }),

  diffmodes: style({
    float: 'right',
  }),

  modeButton: style({
    display: 'inline-block',
    marginLeft: spacing[1],
    fontSize: '.8rem',
    fontWeight: typography.regular,
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  diffNowBtn: style({
    display: 'block',

    position: 'sticky',
    top: '10rem',
    zIndex: 10,

    margin: '0 auto',
    marginTop: '10rem',
    marginBottom: '-13rem',
    paddingLeft: spacing[2],
    paddingRight: spacing[2],

    height: '3rem',

    border: '1px solid black',

    fontSize: '1.2rem',
    lineHeight: '3rem',

    background: color.dark400,

    ':hover': {
      borderColor: color.blue400,
    },
  }),

  result: style({
    pointerEvents: 'auto',
    marginLeft: 'auto',

    '::before': {
      content: '""',
      zIndex: 10,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      opacity: 0,
      background: 'inherit',
      transition: 'opacity 500ms ease-in-out',
    },

    selectors: {
      '&[data-updating]::before': {
        pointerEvents: 'auto',
        opacity: 0.85,
        animationDuration: '667ms',
        animationDelay: '667ms',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
        animationFillMode: 'both',
        animationName: keyframes({
          from: { opacity: 0.85 },
          to: { opacity: 0.55 },
        }),
      },
      '&[data-needs-updating]::before': {
        pointerEvents: 'auto',
        opacity: 0.85,
      },
    },
  }),

  result_diff: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    opacity: 0.67,
  }),
  result_base: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    opacity: 0.67,
  }),
  //result_dirty: style({
  // …
  //}),

  // ---------------------------------------------------------------------------

  warnings: style({
    // marginTop: spacing[1],
    // marginBottom: spacing[2],
    marginLeft: 1,
    marginRight: 1,
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],

    border: '0 solid',
    borderColor: color.yellow400,
    borderBottomWidth: 1,

    backgroundColor: color.yellow100,

    selectors: {
      '&:last-child': {
        marginBottom: -spacing[1],
        borderBottomWidth: 0,
        borderTopWidth: 1,
      },
    },
  }),

  warnings__legend: style({
    fontSize: typography.baseFontSize,
    lineHeight: typography.baseLineHeight,
    fontWeight: typography.semiBold,
  }),

  warnings__list: style({
    marginLeft: spacing[2],
    listStyle: 'square',
  }),

  warnings__item: style({
    // …
  }),

  warnings__item_high: style({
    selectors: {
      '&::marker': {
        fontSize: '1.1em',
        color: 'red',
      },
    },
  }),
  warnings__item_medium: style({
    // …
  }),
  warnings__item_low: style({
    // …
  }),

  warnings__viewToggler: style({
    marginLeft: spacing[1],
    fontSize: '0.67em',
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  warnings__instancelist: style({
    padding: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],
    fontSize: '0.8rem',
    listStyle: 'none',
  }),

  warnings__instance: style({
    display: 'inline-block',
  }),

  warnings__instance__button: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  warnings__instancelist__morecount: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    opacity: 0.67,
  }),
}

// ---------------------------------------------------------------------------

globalStyle(`${classes.toolbar} .tox .tox-menu`, {
  width: 'max-content',
})
globalStyle(`${classes.toolbar} .tox .tox-editor-container`, {
  borderTopRightRadius: theme.border.radius.large,
  borderTopLeftRadius: theme.border.radius.large,
})
globalStyle(`${classes.toolbar} .tox .tox-editor-header`, {
  border: 'none',
})

globalStyle(`${classes.warnings__item_high}::marker`, {
  fontSize: '1.1em',
  color: 'red',
})

// ---------------------------------------------------------------------------
;[classes.editor, classes.result].forEach((wrapper) => {
  const global = regulationContentStyling(wrapper)

  global('table', {
    border: `0 !important`, // Override TinyMCE
  })

  global('th, td', {
    minWidth: '1.5em !important',
    border: `1px solid ${color.dark300} !important`, // Override TinyMCE
  })
  global(
    `
    tr:not(:first-child) > th,
    tr:not(:first-child) > td
    `,
    {
      borderTop: '0 !imporant', // Override TinyMCE
    },
  )
  global(
    `
    tr > th:not(:first-child),
    tr > td:not(:first-child)
    `,
    {
      borderLeft: '0', // Override TinyMCE
    },
  )

  global(
    `
    .layout > * > * > th,
    .layout > * > * > td,
    `,
    {
      border: `2px dashed ${border.color.standard} !important`, // Override TinyMCE
    },
  )

  global('blockquote', {
    marginLeft: '1rem',
    padding: '1rem 1em',
    borderLeft: '0.25em solid rgba(0,0,0, 0.2)',
    backgroundColor: 'rgba(0,0,0, 0.02)',
  })

  global('img', {
    display: 'inline',
    margin: '0.5rem 0.5em',
    maxWidth: 'calc(100% - 0.5em)',
    height: 'auto',
    outline: '0.25em dotted rgba(black, 0.5)',
    outlineOffset: '0.25em',
  })
  global('img:not([alt])', {
    padding: '0.25em',
    border: '0.25em dotted red',
  })

  global('h1, h2, h3, h4, h5, h6', {
    position: 'relative',
    margin: '0 -0.5em',
    marginBottom: '0.75rem',
    padding: '0.5em',
    backgroundColor: 'rgba(0,0,0, 0.1)',
  })
  global(
    `
    h1::before,
    h2::before,
    h3::before,
    h4::before,
    h5::before,
    h6::before,
    `,
    addLegened(),
  )
  global('h1::before', { content: '"H1"' })
  global('h2::before', { content: '"H2"' })
  global('h3::before', { content: '"H3"' })
  global('h4::before', { content: '"H4"' })
  global('h5::before', { content: '"H5"' })
  global('h6::before', { content: '"H6"' })

  global('h1', {
    color: 'red',
  })
  global('h2', {
    marginTop: '2.25rem',
  })
  global('h3', {
    marginTop: '2.25rem',
  })
  global('a', {
    fontWeight: typography.regular,
    color: color.blue400,
    pointerEvents: 'none', // hax to prevent link clicks :/
  })

  global('.document-content', {
    marginBottom: '2ch',
  })

  global('.advertisement__title', {
    marginBottom: '3ch',
  })

  global('.advertisement__title-main', {
    fontSize: 20,
    marginBottom: '0.5ch',
    textTransform: 'uppercase',
    textAlign: 'center',
  })

  global('.advertisement__title-sub', {
    fontSize: 18,
    fontWeight: typography.semiBold,
    textAlign: 'center',
  })

  globalStyle(`.advertisement.readonly *::before`, {
    content: 'none',
  })

  global(
    `
  .advertisement.readonly .section__title,
  .advertisement.readonly .section__title,
  .advertisement.readonly .chapter__title,
  .advertisement.readonly .chapter__title,
  .advertisement.readonly .subchapter__title,
  .advertisement.readonly .subchapter__title,
  .advertisement.readonly .article__title,
  .advertisement.readonly .article__title
  `,
    {
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
      fontSize: typography.baseFontSize,
      lineHeight: typography.baseLineHeight,
      fontStyle: 'italic',
      fontWeight: typography.regular,
    },
  )

  // END OF SIGNATURES

  global('.section__title', {
    marginTop: '3rem',
    marginBottom: '.333rem',
    fontSize: '1.25em',
    fontWeight: typography.headingsFontWeight,
    fontStyle: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(153,0,153, 0.07)',
  })
  global('.chapter__title', {
    marginTop: '3rem',
    marginBottom: '.333rem',
    fontSize: '1.2em',
    fontWeight: typography.headingsFontWeight,
    fontStyle: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(51,0,255, 0.07)',
  })
  global('.subchapter__title', {
    marginTop: '3rem',
    marginBottom: '.333rem',
    fontSize: '1.1em',
    fontWeight: typography.headingsFontWeight,
    fontStyle: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(51,0,255, 0.07)',
  })
  global('.article__title', {
    marginTop: '0',
    marginBottom: '.75rem',
    fontSize: '1.1em',
    fontWeight: typography.headingsFontWeight,
    fontStyle: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(0,102,255, 0.07)',
  })
  global('.section__title::before', {
    content: '"Hluti"',
  })
  global('.chapter__title::before', {
    content: '"Kafli"',
  })
  global('.subchapter__title::before', {
    content: '"Undirkafli"',
  })
  global('.article__title::before', {
    content: '"Grein"',
  })
  global('.article__title--provisional::before', {
    content: '"Grein (bráðabirgða)"',
  })

  global(
    `
    .chapter__title--appendix,
    .appendix__title,
    section.appendix > *:first-child
    `,
    {
      position: 'relative',
      color: 'red',
      boxShadow: '0 1px 0 0 red',
    },
  )
  global(
    `
    .chapter__title--appendix::after,
    .appendix__title::after,
    section.appendix > *:first-child::after
    `,
    addWarning('Viðauka kafli (færa í viðauka)'),
  )

  global(
    `
    .section__title em,
    .section__title i,
    .chapter__title em,
    .chapter__title i,
    .subchapter__title em,
    .subchapter__title i,
    .article__title em,
    .article__title i
    `,
    {
      display: 'block',
      width: 'max-content',
      minWidth: '10rem',
      maxWidth: '96%',
      margin: 'auto',
      marginTop: '.25rem',
      padding: '0 1em',
      fontStyle: 'normal',
      fontSize: '1rem',
      fontWeight: 'normal',
      lineHeight: '2rem',
      // border: '1px dotted rgba(0,0,0, 0.3)',
      // borderWidth: '0 3px',
      backgroundColor: 'rgba(0,0,0, 0.04)',
      boxShadow: '0 0 3px 0px white',
    },
  )

  global(
    `
    .section__title em + br:last-child,
    .section__title i + br:last-child,
    .chapter__title em + br:last-child,
    .chapter__title i + br:last-child,
    .subchapter__title em + br:last-child,
    .subchapter__title i + br:last-child,
    .article__title em + br:last-child,
    .article__title i + br:last-child
    `,
    {
      display: 'block',
    },
  )

  global(
    `
    p.doc__title,
    .Dags,
    .FHUndirskr,
    .Undirritun
    `,
    {
      position: 'relative',
      paddingTop: `0.333rem`,
      boxShadow: `inset -1.5em 0 1em -1em rgba(0,0,0, 0.1)`,
    },
  )
  global(
    `
    p.doc__title::before,
    .Dags::before,
    .FHUndirskr::before,
    .Undirritun::before
    `,
    addLegened({ value: 'attr(class)' }),
  )

  global('.indented', {
    position: 'relative',
    marginLeft: '2em',
  })
  global('.indented::before', addLegened('Inndregin málsgrein'))

  global(
    `
    .footnote,
    .footnote-reference,
    .footnote__marker,
    `,
    { position: 'relative' },
  )
  global('.footnote::before', addLegened('Footnote'))
  global('.footnote-reference::before', addLegened('FR', true))
  global('.footnote__marker::before', addLegened('FM', true))

  global('pre', {
    position: 'relative',
    paddingTop: '.333rem',
    marginBottom: typography.baseLineHeight + 'rem',

    backgroundImage: [
      'linear-gradient(180deg, rgba(0,0,0, 0.05) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(0,0,0, 0.05) 1px, transparent 1px)',
    ].join(', '),
    backgroundPosition: '-1px -1px',
    backgroundSize: '1em 1em',
    boxShadow: '0 0 3px 0 rgba(0,0,0, 0.2)',
  })
  global('pre::before', addLegened('PRE(ascii art)'))

  global('[data-autogenerated]', {
    position: 'relative',
    backgroundColor: 'rgba(204,153,0, 0.05)',
  })
  global('[data-autogenerated]::before', addLegened('Auto-generated'))

  global(
    `ul[data-autogenerated]::before,
    ol[data-autogenerated]::before`,
    {
      content: '"Auto-generated list"',
    },
  )
  global('[style*="margin-left"]', {
    position: 'relative',
    paddingTop: '.333rem',
    boxShadow: [
      '-2em 0 0 rgba(204,153,0, 0.1)',
      'inset 1em 0 0 rgba(204,153,0, 0.1)',
    ].join(', '),
  })
  global('[style*="margin-left"]::after', addWarning('Spássía'))

  global('span[data-cfemail]', {
    display: 'inline-block',
    padding: '0 0.25em',
    textIndent: 0,
    verticalAlign: 'top',
    backgroundColor: 'red',
    color: 'white',
  })
  global('span[data-legacy-indenter]', {
    display: 'inline-block',
    position: 'relative',
    margin: '0 1px',
    lineHeight: '0.8em',
    textIndent: '0',
    textShadow: '0 0 2px white',
    verticalAlign: 'baseline',
    backgroundColor: 'rgba(204,153,0, 0.1)',
    color: 'rgba(255,0,0, 0.5)',
  })
  global(
    `span[data-legacy-indenter]::before,
    span[data-legacy-indenter]::after`,
    {
      content: '""',
      position: 'absolute',
      top: '-0.3em',
      bottom: '-0.3em',
      margin: '0 -2px',
      width: '0.33em',
      border: '1px solid rgba(0,0,0, 0.25)',
    },
  )
  global('span[data-legacy-indenter]::before', {
    left: 0,
    borderRight: 0,
  })
  global('span[data-legacy-indenter]::after', {
    right: 0,
    borderLeft: 0,
  })
})

// {
//   const editorGlobal = makeGlobal(classes.editor)
// }

globalStyle(`${classes.editor} [data-highighted]`, {
  animationName: keyframes({
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
  }),
  animationDelay: '100ms',
  animationDuration: '200ms',
  animationTimingFunction: 'ease-in-out',
  animationDirection: 'alternate',
  animationIterationCount: 4,
})

diffStyling(classes.result)

// OVERRIDES FOR READONLY MODE
