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

export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  padding: `${theme.spacing[1]}px ${theme.spacing[1]}px 0 ${theme.spacing[1]}px`,
})

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
    color: theme.color.blue400,
  },
  ':focus-visible': {
    background: theme.color.mint200,
    boxShadow: `0 0 0 ${theme.border.width.large}px ${theme.color.mint400}`,
    outline: 'none',
  },
  ':active': {
    background: theme.color.blue200,
    color: theme.color.blue400,
  },
})

export const toolbarButtonActive = style({
  background: theme.color.blue200,
  color: theme.color.blue400,
  selectors: {
    '&:hover': {
      background: theme.color.blue200,
      color: theme.color.blue400,
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

// Legibility overlay matching the previous editor's disabled state.
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

globalStyle(`${content} .ProseMirror`, {
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 18,
  fontWeight: 300,
  minHeight: '100%',
  outline: 'none',
  padding: theme.spacing[2],
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
})

globalStyle(`${content} .ProseMirror p`, {
  margin: 0,
})

globalStyle(`${content} .ProseMirror strong, ${content} .ProseMirror b`, {
  fontWeight: 700,
})

globalStyle(`${content} .ProseMirror ul, ${content} .ProseMirror ol`, {
  margin: 0,
  paddingLeft: 32,
})

// Every nesting level keeps the same bullet. The browser default cycles
// disc/circle/square, but the PDF's standard Times fonts only carry the
// bullet glyph, so the editor is pinned to it too rather than showing markers
// the PDF cannot reproduce. An author rule beats the user-agent 'ul ul'
// default at any depth.
globalStyle(`${content} .ProseMirror ul`, {
  listStyleType: 'disc',
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

// --- Highlight color picker --------------------------------------------------

export const colorPicker = style({
  position: 'absolute',
  zIndex: 9999,
  background: 'white',
  border: `${theme.border.width.standard}px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  padding: theme.spacing[1],
  display: 'grid',
  // Word's 15 highlight colors plus the ✕ button fill a 4x4 grid exactly.
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 6,
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
})

export const colorSwatch = style({
  width: 24,
  height: 24,
  border: `${theme.border.width.standard}px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  padding: 0,
  ':hover': {
    border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
  },
})

export const colorSwatchSelected = style({
  border: `${theme.border.width.large}px solid ${theme.color.blue300}`,
})

export const removeColor = style({
  width: 24,
  height: 24,
  border: `${theme.border.width.standard}px solid rgba(0,0,0,0.12)`,
  borderRadius: theme.border.radius.standard,
  cursor: 'pointer',
  background: 'transparent',
  fontSize: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.color.dark400,
  ':hover': {
    background: theme.color.blue100,
  },
})
