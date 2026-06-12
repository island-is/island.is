# TinyMCE Word-Paste Test Plan — Highlight Preservation

Manual test plan for the fix in
`web/src/components/TinyMCE/TinyMCE.tsx` that preserves Word text
highlighting (background color) on paste.

## What changed

1. `paste_retain_style_properties` now includes the `background` shorthand.
   Word emits highlights as `background:yellow` (not `background-color`),
   and TinyMCE's Word filter also remaps `mso-highlight` to `background`.
   Without it, the Word filter deleted the style before our normalization
   hook ran.
2. `parseCssColor` now resolves the CSS color keywords Word uses for its
   highlighter palette (`yellow`, `lime`, `cyan`, `magenta`, `red`, `teal`,
   etc.). Previously only hex and `rgb()/rgba()` parsed, so keyword colors
   were treated as unparseable and stripped.

Expected behavior after the fix: every pasted Word highlight is **snapped to
the nearest color in the editor's own palette** (Yellow, Blue, Mint, Rose,
Purple — see `HighlightColorPicker.tsx`). Colors further than the snap
threshold from any palette color (e.g. black, dark gray) fall back to the
**first palette color (Yellow)** — this is pre-existing, intentional
normalization, not a bug.

## Setup

- Windows machine with desktop Microsoft Word (not Word Online).
- Judicial-system web app running with this branch, on any screen using the
  TinyMCE editor (e.g. indictment court record).
- Open browser DevTools so you can inspect the pasted HTML
  (right-click inside editor → Inspect). Highlights should appear as
  `<span style="background-color: #...">` using a palette hex value.

## Test 1 — Single highlight color

1. In Word, type a sentence and highlight a few words **yellow** with the
   text highlighter tool.
2. Copy and paste into the editor.

**Pass:** the highlighted words appear highlighted (yellow palette color);
un-highlighted text is unaffected. In DevTools the span has a
`background-color` with a hex value, no `mso-*` styles, no classes.

## Test 2 — Multiple highlight colors in one paste

1. In Word, in one paragraph, highlight different words with **yellow**,
   **bright green**, **turquoise**, **pink**, and **blue**.
2. Copy the whole paragraph and paste.

**Pass:** each word keeps a highlight. Colors are snapped to the editor
palette, so they will not match Word exactly — verify each highlighted word
has *some* distinct palette color and that the mapping is stable (pasting
twice gives the same result).

Also try **black** or **gray 50%** highlight: expect it to come through as
the Yellow fallback (documented normalization), not to disappear.

## Test 3 — Mixed content (regression: other formatting)

1. In Word, create a paragraph containing: plain text, **bold** text,
   *italic* text, a highlighted word, and a bold+highlighted word.
   Add a second paragraph indented one level (increase indent).
2. Copy and paste.

**Pass:**
- Bold and italic survive (as `<b>/<strong>` and `<i>/<em>`).
- The highlighted word keeps its highlight; the bold+highlighted word keeps
  both.
- Paragraph structure survives; the indented paragraph still appears
  indented (Word's `margin-left` is normalized to `padding-left` in 40px
  steps — pre-existing behavior, confirm it still works).
- No font names, font sizes, or colors leak in from Word (these were never
  in the retain list and should still be stripped).

## Test 4 — Plain text paste (regression: no style leakage)

1. Open Notepad, type a few lines, copy and paste into the editor.

**Pass:** text pastes as plain paragraphs with the editor's own font. No
spans, no inline styles, no highlight.

2. Also paste a **non-highlighted** snippet from Word (plain text with
   Word's default white/transparent shading).

**Pass:** no highlight or background appears. (Word's `transparent` /
`white` / `windowtext` keywords must still be stripped — this is the
safeguard against black rectangles in the generated PDF.)

## Test 5 — Editor regression checks

With the editor containing previously saved content:

1. **Existing content** loads and renders unchanged (including previously
   applied highlights).
2. **Typing** works normally; no stray styling appears.
3. **Toolbar:** bold, italic, indent, outdent, fullscreen all work.
4. **Highlight button:** open the picker, apply each of the five colors to
   typed text, then use ✕ to remove a highlight. The picker's selected
   state must track the caret (place the caret inside a pasted Word
   highlight — the matching palette swatch should show as selected, since
   pasted colors are snapped to the palette).
5. **Save/blur:** blur the editor and confirm the content persists, then
   generate the relevant PDF and confirm pasted highlights render there
   without black rectangles.

## Test 6 — Copy-paste within the editor (regression)

1. Highlight some text using the editor's own highlight button.
2. Select that text, copy, and paste it elsewhere in the same editor.

**Pass:** the highlight survives the internal paste unchanged.
