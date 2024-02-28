import React, { FC, KeyboardEvent, useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { createEditor, Editor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { DialogsAPI } from '@contentful/app-sdk'

import { withHtml } from '../plugins/withHtml'
import { withShortcuts } from '../plugins/withShortcuts'
import { BlockButton } from './BlockButton'
import { Element } from './Element'
import { Leaf } from './Leaf'
import { LinkButton, withLinks } from './LinkButton'
import { MarkButton, toggleMark } from './MarkButton'
import { Toolbar } from './Toolbar'

export type BaseProps = Record<string, unknown>
export type OrNull<T> = T | null

interface MarkdownEditorProps {
  value: Node[]
  dialogs: DialogsAPI
  onChange(value: Node[]): void
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+l': 'ul_list',
  'mod+o': 'ol_list',
}

export const MarkdownEditor: FC<
  React.PropsWithChildren<MarkdownEditorProps>
> = ({ value, dialogs, onChange }) => {
  const [internalValue, setInternalValue] = useState<Node[]>(value) // We keep track of the original Slate Nodes
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo<Editor>(
    () =>
      // Allow copy/paste of html and format it automatically
      withHtml(
        // Allow markdown shortcuts
        withShortcuts(
          // Display Contentful SDK dialog to add links
          withLinks(
            // Enable undo feature
            withHistory(
              // Allow the editor to work with React
              withReact(
                // Base editor
                createEditor(),
              ),
            ),
          ),
        ),
      ),
    [],
  )

  return (
    <Slate
      editor={editor}
      value={internalValue}
      onChange={(newValue) => {
        setInternalValue(newValue)
        onChange(newValue)
      }}
    >
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <LinkButton dialogs={dialogs} />
        <BlockButton format="heading_two" icon="looks_two" />
        <BlockButton format="heading_three" icon="looks_three" />
        <BlockButton format="heading_four" icon="looks_four" />
        <BlockButton format="ol_list" icon="format_list_numbered" />
        <BlockButton format="ul_list" icon="format_list_bulleted" />
      </Toolbar>

      <Editable
        style={{
          padding: '12px 16px',
          border: '1px solid #d3dce0',
          borderTopColor: 'transparent',
          borderBottomLeftRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(
          event: KeyboardEvent<HTMLDivElement> & { byKey: boolean },
        ) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}
