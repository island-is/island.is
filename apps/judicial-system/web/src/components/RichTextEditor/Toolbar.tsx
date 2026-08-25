import type { FC, ReactNode } from 'react'
import React from 'react'
import cn from 'classnames'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'

import * as styles from './RichTextEditor.css'

// Hand-drawn 20x20 glyphs so the toolbar has no icon-font or asset
// dependency; they follow the shapes of the previous editor's icons.
const BoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6.5 3h5a3.75 3.75 0 0 1 2.45 6.6A3.9 3.9 0 0 1 12.1 17H6.5V3Zm2.8 5.6h2a1.55 1.55 0 1 0 0-3.1h-2v3.1Zm0 5.9h2.6a1.7 1.7 0 1 0 0-3.4H9.3v3.4Z"
    />
  </svg>
)

const ItalicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8.5 3H16v2h-2.7l-3 10H13v2H4.5v-2h2.7l3-10H7.5V3Z"
    />
  </svg>
)

const BulletListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <g fill="currentColor">
      <circle cx="4" cy="5" r="1.5" />
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="4" cy="15" r="1.5" />
      <rect x="8" y="4" width="9" height="2" rx="1" />
      <rect x="8" y="9" width="9" height="2" rx="1" />
      <rect x="8" y="14" width="9" height="2" rx="1" />
    </g>
  </svg>
)

const OrderedListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <g fill="currentColor">
      <text x="2" y="7" fontSize="6.5" fontFamily="inherit">
        1
      </text>
      <text x="2" y="12.5" fontSize="6.5" fontFamily="inherit">
        2
      </text>
      <text x="2" y="18" fontSize="6.5" fontFamily="inherit">
        3
      </text>
      <rect x="8" y="4" width="9" height="2" rx="1" />
      <rect x="8" y="9.5" width="9" height="2" rx="1" />
      <rect x="8" y="15" width="9" height="2" rx="1" />
    </g>
  </svg>
)

const IndentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <g fill="currentColor">
      <rect x="3" y="3.5" width="14" height="2" rx="1" />
      <rect x="9" y="7.5" width="8" height="2" rx="1" />
      <rect x="9" y="11" width="8" height="2" rx="1" />
      <rect x="3" y="14.5" width="14" height="2" rx="1" />
      <path d="M3 7.5l4 2.75L3 13z" />
    </g>
  </svg>
)

const OutdentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <g fill="currentColor">
      <rect x="3" y="3.5" width="14" height="2" rx="1" />
      <rect x="9" y="7.5" width="8" height="2" rx="1" />
      <rect x="9" y="11" width="8" height="2" rx="1" />
      <rect x="3" y="14.5" width="14" height="2" rx="1" />
      <path d="M7 7.5l-4 2.75L7 13z" />
    </g>
  </svg>
)

const HighlightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <g fill="currentColor">
      <path d="M12.9 2.9a1.4 1.4 0 0 1 2 0l2.2 2.2a1.4 1.4 0 0 1 0 2L9.6 14.6 5 15l.4-4.6 7.5-7.5Zm-5 8.4-.15 1.85 1.85-.15 6.5-6.5-1.7-1.7-6.5 6.5Z" />
      <rect x="3" y="16.5" width="14" height="2.5" rx="1" />
    </g>
  </svg>
)

const FullscreenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M3 8V3h5v2H5v3H3Zm14 0V5h-3V3h5v5h-2ZM3 17v-5h2v3h3v2H3Zm9 0v-2h3v-3h2v5h-5Z"
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
    className={cn(styles.toolbarButton, {
      [styles.toolbarButtonActive]: active,
    })}
    aria-label={label}
    aria-pressed={active ?? false}
    // Mousedown is prevented so the editor selection and focus survive the
    // button press and no blur-save fires mid-edit; the action itself runs on
    // click so keyboard activation (Enter/Space) works too.
    onMouseDown={(e) => e.preventDefault()}
    onClick={onAction}
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
