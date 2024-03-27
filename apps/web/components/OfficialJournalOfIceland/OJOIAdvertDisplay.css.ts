import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'
import { regulationContentStyling } from '@island.is/regulations/styling'
const { color, typography, border } = theme

export const bodyText = style({})
const global = regulationContentStyling(bodyText)
/*
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

global('.signatures', {
  display: 'grid',
  gap: '1ch',
  gridTemplateColumns: '1fr 1fr',
})

global('.signature__group + .signature__group', {
  marginTop: '3ch',
})

global('.signatures.single', {
  gridTemplateColumns: '1fr',
})

global('.signatures.double', {
  gridTemplateColumns: '1fr 1fr',
})

global('.signatures.triple', {
  gridTemplateColumns: '1fr 1fr 1fr',
})

global('.signatures.chairman', {
  marginBottom: '2ch',
})

global('.signature', {
  marginTop: '0',
  fontSize: 16,
  fontWeight: typography.semiBold,
  textAlign: 'center',
})

global('.signature__title', {
  marginTop: '0',
  marginBottom: '1ch',
  fontSize: 14,
  fontStyle: 'italic',
  fontWeight: typography.regular,
  textAlign: 'center',
})

global('.signature__textAbove', {
  marginTop: 0,
  marginBottom: 0,
  fontSize: 14,
  fontStyle: 'normal',
  fontWeight: typography.regular,
  textAlign: 'center',
})

global('.signature__nameWrapper', {
  lineHeight: 1.2,
  textAlign: 'center',
  fontSize: 14,
})

global('.signature__name', {
  fontWeight: typography.semiBold,
  marginBottom: '0',
})

global('.signature__textAfter', {
  fontSize: 14,
  fontWeight: typography.regular,
})

global('.signature__textBelow', {
  fontSize: 14,
  textAlign: 'center',
  fontWeight: typography.regular,
})

global('.signature__footer', {
  marginTop: '2ch',
  fontSize: 14,
  textAlign: 'center',
  fontWeight: typography.semiBold,
})

global('.signature__additional', {
  marginTop: '2ch',
  fontStyle: 'italic',
  fontSize: 14,
  textAlign: 'right',
})

global('.document-content', {
  marginBottom: '2ch',
})

global('.advertisement__title', {
  marginBottom: '3ch',
})

global('.advertisement__title-main', {
  fontSize: 20,
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

global('.indented', {
  position: 'relative',
  marginLeft: '2em',
})

global(
  `
  .footnote,
  .footnote-reference,
  .footnote__marker,
  `,
  { position: 'relative' },
)

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

global('[data-autogenerated]', {
  position: 'relative',
  backgroundColor: 'rgba(204,153,0, 0.05)',
})

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
*/
