import { Extension, Mark } from '@tiptap/core'
import { ListItem } from '@tiptap/extension-list'
import { Placeholder } from '@tiptap/extensions'
import { StarterKit } from '@tiptap/starter-kit'

import {
  colorFromHighlightClass,
  highlightClassFromColor,
  indentClassFromLevel,
  levelFromIndentClass,
  MARKER_NONE_CLASS,
  MAX_INDENT_LEVEL,
} from './richTextNormalization'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    classHighlight: {
      setClassHighlight: (color: string) => ReturnType
      unsetClassHighlight: () => ReturnType
    }
    blockIndent: {
      changeBlockIndent: (delta: number) => ReturnType
    }
    richTextListItem: {
      wrapListItemDeeper: () => ReturnType
    }
  }
}

// The document schema doubles as the security boundary: content can only hold
// the nodes, marks and attributes defined here, so foreign elements, classes
// and style attributes from a paste are dropped at parse time and can never
// be serialized towards the API (whose WAF rejects any style="..."). All
// formatting is class-based for the same reason.

// Highlight mark carrying its color as an hl-xxxxxx class — the only span the
// schema can represent. Only classes encoding a valid 6-digit hex color are
// parsed; every other span is unwrapped.
const ClassHighlight = Mark.create({
  name: 'classHighlight',

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => {
          for (const className of Array.from(element.classList)) {
            const color = colorFromHighlightClass(className)
            if (color) {
              return color
            }
          }
          return null
        },
        renderHTML: (attributes) =>
          attributes.color
            ? { class: highlightClassFromColor(attributes.color) }
            : {},
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: (element) => {
          for (const className of Array.from(element.classList)) {
            if (colorFromHighlightClass(className)) {
              return null // null = the rule matches
            }
          }
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setClassHighlight:
        (color) =>
        ({ commands }) =>
          commands.setMark(this.name, { color }),
      unsetClassHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})

// Class-based block indentation (indent-1 … indent-10) on paragraphs outside
// lists — the counterpart of the toolbar's indent/outdent buttons. Inside a
// list those buttons nest items instead, so list content never carries this
// attribute.
const BlockIndent = Extension.create({
  name: 'blockIndent',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          indent: {
            default: 0,
            keepOnSplit: false,
            parseHTML: (element) => {
              for (const className of Array.from(element.classList)) {
                const level = levelFromIndentClass(className)
                if (level !== null) {
                  return level
                }
              }
              return 0
            },
            renderHTML: (attributes) =>
              attributes.indent > 0
                ? { class: indentClassFromLevel(attributes.indent) }
                : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      changeBlockIndent:
        (delta) =>
        ({ state, tr, dispatch }) => {
          let changed = false
          const { from, to } = state.selection
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name !== 'paragraph') {
              return
            }
            const current: number = node.attrs.indent ?? 0
            const next = Math.min(
              MAX_INDENT_LEVEL,
              Math.max(0, current + delta),
            )
            if (next !== current) {
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  indent: next,
                })
              }
              changed = true
            }
          })
          return changed
        },
    }
  },
})

// List items relaxed in two ways the PDF renderer already understands: the
// content expression allows a nested list as the first child (the default
// demands a leading paragraph), and a marker-none class suppresses the marker
// on wrapper items — both used for skipped-level nesting (a level-1 → level-3
// Word paste).
const RichTextListItem = ListItem.extend({
  content: 'block+',

  addAttributes() {
    return {
      markerNone: {
        default: false,
        parseHTML: (element) => element.classList.contains(MARKER_NONE_CLASS),
        renderHTML: (attributes) =>
          attributes.markerNone ? { class: MARKER_NONE_CLASS } : {},
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      // sinkListItem nests an item under its previous sibling, so it cannot
      // indent an item that has none. The previous editor kept indenting past
      // the available nesting by wrapping the item in a marker-suppressed
      // item holding a deeper list — the same marker-none model the paste
      // pipeline and the PDF renderer use — so this command does that when
      // sinking is impossible.
      wrapListItemDeeper:
        () =>
        ({ state, tr, dispatch }) => {
          const { $from, $to } = state.selection
          const listItemType = state.schema.nodes[this.name]
          const range = $from.blockRange(
            $to,
            (node) =>
              node.childCount > 0 && node.firstChild?.type === listItemType,
          )
          if (!range) return false
          // With a previous sibling the normal sink applies; this command is
          // only the fallback.
          if (range.startIndex > 0) return false
          if (dispatch) {
            tr.wrap(range, [
              { type: listItemType, attrs: { markerNone: true } },
              { type: range.parent.type, attrs: range.parent.attrs },
            ])
          }
          return true
        },
    }
  },
})

export const buildEditorExtensions = (placeholder: string) => [
  StarterKit.configure({
    // Everything not listed in the toolbar is disabled so the schema cannot
    // represent it: pasted headings, quotes, links, code etc. are unwrapped
    // to plain content at parse time.
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: false,
    strike: false,
    underline: false,
    // Replaced by RichTextListItem below.
    listItem: false,
    // Would append an empty trailing <p> to the document after a list, which
    // would then be serialized and saved; Enter-Enter exits a list instead.
    trailingNode: false,
  }),
  RichTextListItem,
  ClassHighlight,
  BlockIndent,
  Placeholder.configure({ placeholder }),
]
