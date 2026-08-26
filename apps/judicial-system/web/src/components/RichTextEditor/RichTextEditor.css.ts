import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

import {
  highlightClassFromColor,
  INDENT_STEP_PX,
  indentClassFromLevel,
  MARKER_NONE_CLASS,
  MAX_INDENT_LEVEL,
  WORD_HIGHLIGHT_COLORS,
} from './richTextNormalization'

export const label = style({
  display: 'block',
  color: theme.color.blue400,
  fontWeight: theme.typography.medium,
  fontSize: 12,
  lineHeight: 1.3333333333,
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px 0 ${theme.spacing[1]}px`,
  transition: 'color 0.1s',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 14,
      lineHeight: 1.1428571429,
      padding: `${theme.spacing[1]}px ${theme.spacing[3]}px 0 ${theme.spacing[1]}px`,
    },
  },
})

export const labelError = style({
  color: theme.color.red600,
})

export const labelDisabled = style({
  color: theme.color.blue300,
})

export const wrapper = style({
  position: 'relative',
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',
  // Matches the island-ui Input background so the label row doesn't show the
  // color of a tinted container (e.g. BlueBox) behind it.
  backgroundColor: theme.color.white,

  '::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    transition: 'box-shadow 0.2s',
    boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue200}`,
  },

  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue400}`,
    },
  },
})

export const wrapperDisabled = style({
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.blue200}`,
    },
  },
})

export const wrapperFocused = style({
  '::before': {
    boxShadow: `inset 0 0 0 ${theme.border.width.xl}px ${theme.color.mint400}`,
  },
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.xl}px ${theme.color.mint400}`,
    },
  },
})

export const wrapperError = style({
  '::before': {
    boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.red600}`,
  },
  selectors: {
    '&:hover::before': {
      boxShadow: `inset 0 0 0 ${theme.border.width.standard}px ${theme.color.red600}`,
    },
  },
})

// Fullscreen keeps the editor in place in the DOM and pins the wrapper over
// the viewport. The column layout lets the content area take the remaining
// height under the label and toolbar.
export const wrapperFullscreen = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1200,
  borderRadius: 0,
  display: 'flex',
  flexDirection: 'column',
})

// With no stacking-context ancestors the z-index above is enough to cover the
// page, but an ancestor that forms one (e.g. the motion reorder items around
// indictment counts) traps that z-index, letting later-painted page chrome —
// the form stepper, sibling drag handles — draw on top of the fullscreen
// editor. While fullscreen is active, promote every ancestor of the editor so
// its chain wins at each stacking level. Position relative makes z-index
// effective on ancestors that are otherwise static; it is layout-neutral
// since no offsets are set, and the rule only applies while the editor covers
// the viewport anyway.
globalStyle(`body :has(${wrapperFullscreen})`, {
  position: 'relative',
  zIndex: 1200,
})

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0,
  padding: `4px ${theme.spacing[1]}px 5px`,
  // Full-width divider between the toolbar and the content area.
  borderBottom: `${theme.border.width.standard}px solid ${theme.color.dark200}`,
})

// The icon keeps its color in every state — hover, press and toggled-on are
// signalled by the background only.
export const toolbarButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  border: 'none',
  borderRadius: theme.border.radius.standard,
  background: 'transparent',
  color: theme.color.dark400,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    background: theme.color.blue100,
  },
  ':focus-visible': {
    background: theme.color.mint200,
    boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.color.mint400}`,
    outline: 'none',
  },
  ':active': {
    background: theme.color.blue200,
  },
})

export const toolbarButtonActive = style({
  background: theme.color.blue200,
  selectors: {
    '&:hover': {
      background: theme.color.blue200,
    },
  },
})

// The scrollable area around the ProseMirror content. Its height is set
// inline from the height prop; in fullscreen it grows instead.
export const editorArea = style({
  overflowY: 'auto',
  position: 'relative',
})

// The inline height from the height prop is omitted in fullscreen, so the
// area can flex-grow under the label and toolbar instead.
export const editorAreaFullscreen = style({
  flex: 1,
})

// Tint marking the content read-only while keeping it legible.
export const editorAreaDisabled = style({
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: theme.color.blue100,
    opacity: 0.35,
    pointerEvents: 'none',
    zIndex: 1,
  },
})

export const content = style({
  height: '100%',
})

// --- Content styles ---------------------------------------------------------
// All formatting is class-based (see richTextNormalization.ts): the WAF in
// front of the API blocks any request body containing a style="..." attribute,
// so the editor must never emit inline styles. These rules make the classes
// render in the editor.

// Typography mirrors the island-ui Input textarea (see
// libs/island-ui/core/src/lib/Input/Input.mixins.ts) so the editor reads like
// the other input fields around it: same theme font stack, light weight,
// responsive 16/18px size, dark400 text and blue caret.
globalStyle(`${content} .ProseMirror`, {
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  fontWeight: theme.typography.light,
  color: theme.color.dark400,
  caretColor: theme.color.blue400,
  minHeight: '100%',
  outline: 'none',
  // island-ui fields inset their text by container padding (8px) plus the
  // input element's own padding (8px mobile, 16px desktop); the editor has no
  // inner element, so the sum is applied here to line the text up with them.
  padding: `${theme.spacing[2]}px ${theme.spacing[2]}px`,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 18,
      padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
    },
  },
})

globalStyle(`${content} .ProseMirror p`, {
  margin: 0,
  // The island-ui global reset puts font-weight: normal directly on every p,
  // which beats the weight inherited from the rule above — undo it so the
  // editor's light weight reaches the text.
  fontWeight: 'inherit',
})

// _app.tsx loads the 700 and 700-italic faces specifically for the editor's
// bold; island-ui itself tops out at semiBold, so the theme has no token for
// this weight.
globalStyle(`${content} .ProseMirror strong, ${content} .ProseMirror b`, {
  fontWeight: 700,
})

globalStyle(`${content} .ProseMirror ul, ${content} .ProseMirror ol`, {
  margin: 0,
  paddingLeft: 32,
  // The island-ui reset also sets font-weight: normal on ul/ol, which list
  // items would pass on to the paragraphs inside them.
  fontWeight: 'inherit',
})

// Every nesting level keeps the same bullet. The browser default cycles
// disc/circle/square, but the PDF's standard Times fonts only carry the
// bullet glyph, so the editor is pinned to it too rather than showing markers
// the PDF cannot reproduce. An author rule beats the user-agent 'ul ul'
// default at any depth.
globalStyle(`${content} .ProseMirror ul`, {
  listStyleType: 'disc',
})

// The island-ui global reset strips list markers (list-style: none on ul and
// untyped ol), so ordered lists must restore theirs explicitly too.
globalStyle(`${content} .ProseMirror ol`, {
  listStyleType: 'decimal',
})

globalStyle(`${content} .ProseMirror li.${MARKER_NONE_CLASS}`, {
  listStyleType: 'none',
})

// The placeholder the Placeholder extension renders on the empty document.
globalStyle(`${content} .ProseMirror p.is-editor-empty:first-child::before`, {
  content: 'attr(data-placeholder)',
  float: 'left',
  height: 0,
  pointerEvents: 'none',
  color: theme.color.dark300,
})

for (const { color } of WORD_HIGHLIGHT_COLORS) {
  globalStyle(`${content} .ProseMirror .${highlightClassFromColor(color)}`, {
    backgroundColor: color,
  })
}

for (let level = 1; level <= MAX_INDENT_LEVEL; level++) {
  globalStyle(`${content} .ProseMirror .${indentClassFromLevel(level)}`, {
    paddingLeft: level * INDENT_STEP_PX,
  })
}
