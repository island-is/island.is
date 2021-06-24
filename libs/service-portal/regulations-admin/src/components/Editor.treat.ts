import { EditorClasses } from '@hugsmidjan/regulations-editor/Editor'
import { style, Style, globalStyle } from 'treat'

const $fontSize = '1rem'
const $lineHeight = '1.5rem'
const $col1 = 0.58
const $gap = 0.01
const $col2 = 1 - $col1 - $gap

const regulationEditingStyling = (): Style => ({
  selectors: {
    // p,
    // ul,
    // ol,
    // table,
    // blockquote,
    // pre {
    //   margin: 0 0 (0.75 * $lineHeight) 0;
    // }
    // li,
    // li > p,
    // li > ul,
    // li > ol,
    // li > table,
    // li > blockquote,
    // li > pre {
    //   margin: 0 0 (0.5 * $lineHeight) 0;
    // }
    // p:last-child,
    // ul:last-child,
    // ol:last-child,
    // table:last-child:not(:global(figure.table) > *) {
    //   margin-bottom: 0;
    // }
    // table {
    //   --border-style: 1px solid #{rgba(black, 0.35)}; // override TinyMCE;
    //   width: 100%;
    //   border: 0 !important; // override TinyMCE
    //   border-collapse: separate;
    // }
    // table:global(.layout) {
    //   --border-style: 2px dashed #{rgba(black, 0.05)};
    // }
    // ul {
    //   padding-left: 2em;
    //   list-style-type: disc;
    // }
    // li ul {
    //   list-style-type: circle;
    // }
    // li li ul {
    //   list-style-type: square;
    // }
    // ol {
    //   padding-left: 2em;
    // }
    // li::marker {
    //   color: #a0c;
    // }
    // th,
    // td {
    //   padding: (0.25 * $lineHeight) 0.5em;
    //   min-width: 1.5em; // override TinyMCE
    //   border: var(--border-style) !important; // override TinyMCE
    //   text-align: left;
    //   vertical-align: top;
    // }
    // tr:not(:first-child) > th,
    // tr:not(:first-child) > td {
    //   border-top: 0 !important; // override TinyMCE
    // }
    // tr > th:not(:first-child),
    // tr > td:not(:first-child) {
    //   border-left: 0 !important; // override TinyMCE
    // }
    // th {
    //   font-weight: bold;
    //   background-color: rgba(black, 0.05);
    // }
    // thead tr:last-child th {
    //   border-bottom: 2px solid rgba(black, 0.3);
    // }
    // tfoot tr:first-child td,
    // tfoot tr:first-child th {
    //   border-top: 1px solid rgba(black, 0.5);
    // }
    // strong,
    // b {
    //   font-weight: bold;
    // }
    // em,
    // i {
    //   font-style: italic;
    // }
    // img {
    //   display: inline;
    //   margin: (0.33 * $lineHeight) 0.5em;
    //   max-width: calc(100% - 0.5em);
    //   height: auto;
    //   outline: 0.25em dotted var(--diff-color, rgba(black, 0.5));
    //   outline-offset: 0.25em;
    // }
    // img:not([alt]) {
    //   padding: 0.25em;
    //   border: 0.25em dotted red;
    // }
    // h1,
    // h2,
    // h3,
    // h4,
    // h5,
    // h6 {
    //   ...addLegened(),
    //   margin: 0 -0.25em;
    //   margin-bottom: (0.5 * $lineHeight);
    //   padding: (0.25 * $lineHeight) 0.5em;
    //   font-weight: bold;
    //   background-color: rgba(black, 0.1);
    // }
    // h1::before {
    //   content: 'H1';
    // }
    // h2:not([class])::before {
    //   content: 'H2';
    // }
    // h3:not([class])::before {
    //   content: 'H3';
    // }
    // h4::before {
    //   content: 'H4';
    // }
    // h5::before {
    //   content: 'H5';
    // }
    // h6::before {
    //   content: 'H6';
    // }
    // h1 {
    //   font-size: 1.2em;
    //   color: #ff0000;
    // }
    // h2 {
    //   margin-top: (1.5 * $lineHeight);
    //   font-size: 1.2em;
    // }
    // h3 {
    //   margin-top: (1.5 * $lineHeight);
    //   font-size: 1.1em;
    // }
    // h2:global(.chapter__title),
    // h3:global(.article__title) {
    //   // padding-top: (0.25*$lineHeight);
    //   // padding-bottom: (0.25*$lineHeight);
    //   margin-top: (2 * $lineHeight);
    //   margin-bottom: (0.25 * $lineHeight);
    //   font-size: 1.2em;
    //   font-weight: bold;
    //   text-align: center;
    //   background-color: rgba(#60f, 0.06);
    // }
    // h3:global(.article__title) {
    //   margin-top: 0;
    //   margin-bottom: (0.5 * $lineHeight);
    //   font-size: 1.1em;
    //   background-color: rgba(#06f, 0.06);
    // }
    // h2:global(.chapter__title)::before {
    //   content: 'Kafli';
    // }
    // h3:global(.article__title)::before {
    //   content: 'Grein';
    // }
    // h3:global(.article__title--provisional)::before {
    //   content: 'Grein (bráðabirgða)';
    // }
    // h2:global(.chapter__title--appendix),
    // h2:global(.appendix__title),
    // section:global(.appendix) > *:first-child {
    //   ...addWarning('Viðauka kafli (færa í viðauka)'),
    //   color: red;
    //   box-shadow: 0 1px 0 0 red;
    // }
    // h2:first-child,
    // h3:first-child {
    //   margin-top: 0;
    // }
    // h2:global(.chapter__title) em,
    // h2:global(.chapter__title) i,
    // h3:global(.article__title) em,
    // h3:global(.article__title) i {
    //   display: block;
    //   margin: 0 1em;
    //   font-style: normal;
    //   font-weight: normal;
    //   line-height: (1.5 * $lineHeight);
    //   // border: 1px dotted rgba(black, 0.3);
    //   // border-width: 0 3px;
    //   background-color: rgba(black, 0.04);
    //   box-shadow: 0 0 3px 0px white;
    // }
    // // h2 em::before,
    // // h3 em::before,
    // // h2 i::before,
    // // h3 i::before {
    // //   content: '  —  ';
    // //   text-shadow: 0 0 3px white, 0 0 6px white;
    // // }
    // blockquote {
    //   padding: (0.5 * $lineHeight) 1em;
    //   border-left: 0.25em solid rgba(black, 0.2);
    //   background-color: rgba(black, 0.02);
    // }
    // :global(p.doc__title),
    // :global(.Dags),
    // :global(.FHUndirskr),
    // :global(.Undirritun) {
    //   ...addLegened(attr(class)),
    //   padding-top: (0.25 * $lineHeight);
    //   box-shadow: -1em 0 0 rgba(black, 0.5);
    // }
    // p:global(.indented) {
    //   ...addLegened('Inndregin málsgrein'),
    //   margin-left: 2rem;
    // }
    // p:global(.footnote) {
    //   ...addLegened('Footnote'),
    // }
    // sup:global(.footnote-reference) {
    //   ...addLegened('FR', $tiny: true),
    // }
    // sup:global(.footnote__marker) {
    //   ...addLegened('FM', $tiny: true),
    // }
    // sub,
    // sup {
    //   font-size: 0.8em;
    // }
    // pre {
    //   $line: rgba(black, 0.05);
    //   ...addLegened('PRE(ascii art)'),
    //   padding-top: (0.25 * $lineHeight);
    //   margin-bottom: $lineHeight;
    //   background-image: (
    //     linear-gradient(180deg, $line 1px, transparent 1px),
    //     linear-gradient(90deg, $line 1px, transparent 1px)
    //   );
    //   background-position: -1px -1px;
    //   background-size: 1em 1em;
    //   box-shadow: 0 0 3px 0 rgba(black, 0.2);
    // }
    // [data-autogenerated] {
    //   ...addLegened('Auto-generated'),
    //   background-color: rgba(#cc9900, 0.05);
    // }
    // ul[data-autogenerated]::before,
    // ol[data-autogenerated]::before {
    //   content: 'Auto-generated list';
    // }
    // span[data-cfemail] {
    //   display: inline-block;
    //   padding: 0 0.25em;
    //   text-indent: 0;
    //   vertical-align: top;
    //   background-color: red;
    //   color: white;
    // }
    // span[data-legacy-indenter] {
    //   display: inline-block;
    //   position: relative;
    //   margin: 0 1px;
    //   line-height: 0.8em;
    //   text-indent: 0;
    //   text-shadow: 0 0 2px white;
    //   vertical-align: baseline;
    //   background-color: rgba(#cc9900, 0.1);
    //   color: rgba(red, 0.5);
    // }
    // span[data-legacy-indenter]::before,
    // span[data-legacy-indenter]::after {
    //   content: '';
    //   position: absolute;
    //   top: -0.3em;
    //   bottom: -0.3em;
    //   margin: 0 -2px;
    //   width: 0.33em;
    //   border: 1px solid rgba(black, 0.25);
    // }
    // span[data-legacy-indenter]::before {
    //   left: 0;
    //   border-right: 0;
    // }
    // span[data-legacy-indenter]::after {
    //   right: 0;
    //   border-left: 0;
    // }
    // [style*='margin-left'] {
    //   ...addWarning('Spássía'),
    //   padding-top: (0.25 * $lineHeight);
    //   box-shadow: (-2em 0 0 rgba(#cc9900, 0.1), inset 1em 0 0 rgba(#cc9900, 0.1));
    // }
  },
})

const highlightAnimation = (): Style => ({
  ['@keyframes']: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
  },
  animationDelay: '100ms',
  animationDuration: '200ms',
  animationTimingFunction: 'ease-in-out',
  animationDirection: 'alternate',
  animationIterationCount: 4,
})

// ---------------------------------------------------------------------------

const addLegened = (
  $legend?: string | { value: string },
  $tiny?: boolean,
  $warning?: boolean,
): Style => {
  let beforeOrAfter = ':before'
  let color = '#555'
  let backgroundColor = '#dde9cc'

  if ($warning) {
    beforeOrAfter = ':after'
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
    position: 'relative',

    [beforeOrAfter]: {
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
    },
  }
}
const addWarning = ($legend: Parameters<typeof addLegened>[0]) =>
  addLegened($legend, false, true)

// ===========================================================================

export const classes: EditorClasses = {
  wrapper: style({
    position: 'relative',
  }),

  editingpane: style({
    display: 'flex',
    flexFlow: 'column',
  }),

  editorBooting: style({
    height: '10em',
  }),

  toolbar: style({
    // …
  }),

  editor: style({
    // …
  }),

  comparisonpane: style({
    // …
  }),

  headline: style({
    // …
  }),

  diffmodes: style({
    // …
  }),

  modeButton: style({
    // …
  }),

  result: style({
    // …
  }),

  result_diff: style({
    // …
  }),

  result_base: style({
    // …
  }),

  result_dirty: style({
    // …
  }),

  // ---------------------------------------------------------------------------

  warnings: style({
    // …
  }),

  warnings__legend: style({
    // …
  }),

  warnings__list: style({
    // …
  }),

  warnings__item: style({
    // …
  }),

  warnings__item_high: style({
    // …
  }),
  warnings__item_medium: style({
    // …
  }),
  warnings__item_low: style({
    // …
  }),

  warnings__viewToggler: style({
    // …
  }),

  warnings__instancelist: style({
    // …
  }),

  warnings__instance: style({
    // …
  }),

  warnings__instance__button: style({
    // …
  }),

  warnings__instancelist__morecount: style({
    // …
  }),
}
