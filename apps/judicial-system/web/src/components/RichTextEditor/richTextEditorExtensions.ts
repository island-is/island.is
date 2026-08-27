import { Extension, Mark, mergeAttributes } from '@tiptap/core'
import { ListItem } from '@tiptap/extension-list'
import { Table, TableCell, TableRow } from '@tiptap/extension-table'
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
      setClassHighlight: (color) => ({ commands }) =>
        commands.setMark(this.name, { color }),
      unsetClassHighlight: () => ({ commands }) =>
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
      changeBlockIndent: (delta) => ({ state, tr, dispatch }) => {
        let changed = false
        const { from, to } = state.selection
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type.name !== 'paragraph') {
            return
          }
          const current: number = node.attrs.indent ?? 0
          const next = Math.min(MAX_INDENT_LEVEL, Math.max(0, current + delta))
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
  // Spelled out rather than 'block+' so a table (which is in the block group)
  // can never nest inside a list item; the list of node types is otherwise
  // exactly the block group.
  content: '(paragraph | bulletList | orderedList)+',

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
      // indent an item that has none. To keep indenting past the available
      // nesting, wrap the item in a marker-suppressed item holding a deeper
      // list — the same marker-none model the paste pipeline and the PDF
      // renderer use.
      wrapListItemDeeper: () => ({ state, tr, dispatch }) => {
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

// Tables serialize as bare <table><tbody><tr><td> with no attributes. The
// stock extension emits a style attribute (width/min-width) plus a styled
// <colgroup> on every table, which the WAF would reject. Headers, merged
// cells and column widths are out of scope, so their attributes are pinned or
// removed; the PDF renderer lays cells out at equal widths to match.
const RichTextTable = Table.extend({
  // The stock renderHTML always injects a colgroup and a style attribute;
  // emit neither.
  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['tbody', 0],
    ]
  },

  // Without the TableView node view the live editor DOM matches the
  // serialized output (no wrapper div, no colgroup, no inline widths); the
  // table lays out through the editor CSS instead.
  addNodeView() {
    return null
  },

  addCommands() {
    const parent = this.parent?.()
    return {
      ...parent,
      // The stock command defaults withHeaderRow to true and would then look
      // up the header-cell node, which this schema deliberately lacks — force
      // plain rows no matter how the command is called.
      insertTable: ({ rows = 3, cols = 3 } = {}) => (props) =>
        parent?.insertTable
          ? parent.insertTable({ rows, cols, withHeaderRow: false })(props)
          : false,
    }
  },
}).configure({ resizable: false }) // resizing would write colwidth → styles

const RichTextTableRow = TableRow.extend({
  // The stock expression references tableHeader, which is not in the schema
  // (building the schema would throw on the unknown node).
  content: 'tableCell*',
})

const RichTextTableCell = TableCell.extend({
  // Paragraphs and lists, but never a nested table: content the schema cannot
  // fit into a cell is hoisted out behind the table by the parser, so pasted
  // lists must be representable in place — nested tables are instead
  // flattened by the paste/load normalization before they reach the parser.
  content: '(paragraph | bulletList | orderedList)+',

  addAttributes() {
    // prosemirror-tables reads colspan/rowspan on every cell, so the
    // attributes must exist — but merges are unsupported, so they are pinned
    // to 1, never parsed from pasted HTML and never serialized. The stock
    // colwidth and align attributes are gone entirely: align would render a
    // style attribute, colwidth a styled colgroup.
    return {
      colspan: { default: 1, parseHTML: () => 1, rendered: false },
      rowspan: { default: 1, parseHTML: () => 1, rendered: false },
    }
  },

  parseHTML() {
    // th parses as a plain cell: header semantics are out of scope, but
    // pasted header text must survive.
    return [{ tag: 'td' }, { tag: 'th' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
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
  RichTextTable,
  RichTextTableRow,
  RichTextTableCell,
  Placeholder.configure({ placeholder }),
]
