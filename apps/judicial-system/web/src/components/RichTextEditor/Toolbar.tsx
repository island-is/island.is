import type { FC, ReactNode } from 'react'
import React from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'

import * as styles from './RichTextEditor.css'

// Hand-drawn 24x24 glyphs so the toolbar has no icon-font or asset
// dependency; they follow the shapes of the previous editor's icons.
const BoldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7 3.5h5.8c2.6 0 4.5 1.55 4.5 3.9 0 1.6-.85 2.8-2.1 3.35 1.7.5 2.8 1.9 2.8 3.75 0 2.5-2 4-4.8 4H7v-15Zm3.1 6.1h2.35c1.15 0 1.9-.65 1.9-1.65 0-1-.75-1.6-1.9-1.6H10.1v3.25Zm0 6.05h2.85c1.25 0 2.05-.7 2.05-1.75s-.8-1.7-2.05-1.7H10.1v3.45Z"
    />
  </svg>
)

const ItalicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M10.6 3.8h7v1.8h-2.9l-3.2 12.8h2.5v1.8H6.7v-1.8h2.8l3.2-12.8h-2.1V3.8Z"
    />
  </svg>
)

const BulletListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <circle cx="4.7" cy="6" r="1.9" />
      <circle cx="4.7" cy="12" r="1.9" />
      <circle cx="4.7" cy="18" r="1.9" />
      <rect x="9.5" y="4.9" width="11" height="2.2" rx="1.1" />
      <rect x="9.5" y="10.9" width="11" height="2.2" rx="1.1" />
      <rect x="9.5" y="16.9" width="11" height="2.2" rx="1.1" />
    </g>
  </svg>
)

const OrderedListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <text x="2.6" y="8" fontSize="6.8" fontWeight="600" fontFamily="inherit">
        1
      </text>
      <text
        x="2.6"
        y="14.6"
        fontSize="6.8"
        fontWeight="600"
        fontFamily="inherit"
      >
        2
      </text>
      <text
        x="2.6"
        y="21.2"
        fontSize="6.8"
        fontWeight="600"
        fontFamily="inherit"
      >
        3
      </text>
      <rect x="9.5" y="4.4" width="11" height="2.2" rx="1.1" />
      <rect x="9.5" y="11" width="11" height="2.2" rx="1.1" />
      <rect x="9.5" y="17.6" width="11" height="2.2" rx="1.1" />
    </g>
  </svg>
)

const IndentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="3" y="4" width="18" height="2.2" rx="1.1" />
      <rect x="10.5" y="8.6" width="10.5" height="2.2" rx="1.1" />
      <rect x="10.5" y="13.2" width="10.5" height="2.2" rx="1.1" />
      <rect x="3" y="17.8" width="18" height="2.2" rx="1.1" />
      <path d="M3 8.4l5.2 3.6L3 15.6V8.4Z" />
    </g>
  </svg>
)

const OutdentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="3" y="4" width="18" height="2.2" rx="1.1" />
      <rect x="10.5" y="8.6" width="10.5" height="2.2" rx="1.1" />
      <rect x="10.5" y="13.2" width="10.5" height="2.2" rx="1.1" />
      <rect x="3" y="17.8" width="18" height="2.2" rx="1.1" />
      <path d="M8.2 8.4L3 12l5.2 3.6V8.4Z" />
    </g>
  </svg>
)

const HighlightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <path d="M16.6 3.2a1.6 1.6 0 0 1 2.26 0l1.94 1.94a1.6 1.6 0 0 1 0 2.26L11 17.2 6 18l.8-5L16.6 3.2Z" />
      <rect x="3.5" y="19.5" width="17" height="2.8" rx="1" />
    </g>
  </svg>
)

// Ionicons expand-outline (MIT), inlined like the other glyphs.
const FullscreenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden="true">
    <path
      d="M432 320v112H320M421.8 421.77 304 304M80 192V80h112M90.2 90.23 208 208M320 80h112v112M421.77 90.2 304 208M192 432H80V320M90.23 421.8 208 304"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="44"
    />
  </svg>
)

const ToolbarButton: FC<{
  label: string
  active?: boolean
  onAction: () => void
  children: ReactNode
}> = ({ label, active, onAction, children }) => (
  <button
    type="button"
    className={`${styles.toolbarButton}${
      active ? ` ${styles.toolbarButtonActive}` : ''
    }`}
    aria-label={label}
    aria-pressed={active ?? false}
    // Mousedown instead of click, prevented, so the editor selection and
    // focus survive the button press and no blur-save fires mid-edit.
    onMouseDown={(e) => {
      e.preventDefault()
      onAction()
    }}
  >
    {children}
  </button>
)

interface Props {
  editor: Editor | null
  highlightPickerOpen: boolean
  onToggleHighlightPicker: () => void
  fullscreen: boolean
  onToggleFullscreen: () => void
}

const Toolbar: FC<Props> = ({
  editor,
  highlightPickerOpen,
  onToggleHighlightPicker,
  fullscreen,
  onToggleFullscreen,
}) => {
  const state = useEditorState({
    editor,
    selector: (ctx) =>
      ctx.editor
        ? {
            bold: ctx.editor.isActive('bold'),
            italic: ctx.editor.isActive('italic'),
            bulletList: ctx.editor.isActive('bulletList'),
            orderedList: ctx.editor.isActive('orderedList'),
          }
        : null,
  })

  if (!editor) {
    return null
  }

  const inList = Boolean(state?.bulletList || state?.orderedList)

  const changeIndent = (delta: number) => {
    // Inside a list, indenting means nesting the item rather than padding it.
    if (inList) {
      if (delta > 0) {
        editor.chain().focus().sinkListItem('listItem').run()
      } else {
        editor.chain().focus().liftListItem('listItem').run()
      }
      return
    }
    editor.chain().focus().changeBlockIndent(delta).run()
  }

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
      <ToolbarButton
        label="Bold"
        active={state?.bold}
        onAction={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={state?.italic}
        onAction={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={state?.bulletList}
        onAction={() => editor.chain().focus().toggleBulletList().run()}
      >
        <BulletListIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={state?.orderedList}
        onAction={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <OrderedListIcon />
      </ToolbarButton>
      <ToolbarButton label="Increase indent" onAction={() => changeIndent(1)}>
        <IndentIcon />
      </ToolbarButton>
      <ToolbarButton label="Decrease indent" onAction={() => changeIndent(-1)}>
        <OutdentIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Highlight"
        active={highlightPickerOpen}
        onAction={onToggleHighlightPicker}
      >
        <HighlightIcon />
      </ToolbarButton>
      <ToolbarButton
        label="Fullscreen"
        active={fullscreen}
        onAction={onToggleFullscreen}
      >
        <FullscreenIcon />
      </ToolbarButton>
    </div>
  )
}

export default Toolbar
