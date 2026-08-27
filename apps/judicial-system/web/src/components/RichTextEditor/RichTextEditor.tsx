import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import { AnimatePresence } from 'motion/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'

import { ErrorMessage } from '@island.is/island-ui/core'
import RequiredStar from '@island.is/judicial-system-web/src/components/RequiredStar/RequiredStar'

import HighlightColorPicker from './HighlightColorPicker'
import { buildEditorExtensions } from './richTextEditorExtensions'
import {
  normalizePastedHtml,
  normalizeRichTextHtml,
} from './richTextNormalization'
import type { TableAction } from './TableActionPicker'
import TableActionPicker from './TableActionPicker'
import Toolbar from './Toolbar'
import * as styles from './RichTextEditor.css'

// The height prop describes the whole editor, toolbar row included, so the
// scrollable content area gets the remainder.
const TOOLBAR_HEIGHT = 42

// Everything pasted from outside the editor is raw clipboard HTML (Word,
// Google Docs, ...) and goes through artifact removal, fake-list conversion
// and style-to-class normalization before the schema parses it.
// Editor-internal pastes (marked data-pm-slice) are already schema-clean.
const transformPastedHTML = (html: string) =>
  html.includes('data-pm-slice') ? html : normalizePastedHtml(html)

interface Props {
  label: string
  placeholder: string
  defaultValue?: string
  // The current content as held by the caller. Unlike defaultValue, changes
  // to this prop are synced into a mounted editor (unless it has focus), so
  // callers that regenerate content outside the editor can keep it in sync.
  value?: string
  onChange?: (html: string) => void
  onDebouncedChange?: (html: string) => void
  onBlur?: (html: string) => void
  disabled?: boolean
  errorMessage?: string
  required?: boolean
  height?: number
  'data-testid'?: string
}

const RichTextEditor = ({
  label,
  placeholder,
  defaultValue,
  value,
  onChange,
  onDebouncedChange,
  onBlur,
  disabled,
  errorMessage,
  required,
  height = 450,
  'data-testid': dataTestId,
}: Props) => {
  const labelId = useId()
  const [focused, setFocused] = useState<boolean>(false)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [pickerOpen, setPickerOpen] = useState<boolean>(false)
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const [tablePickerOpen, setTablePickerOpen] = useState<boolean>(false)
  const [tablePickerPos, setTablePickerPos] = useState<{
    top: number
    left: number
  }>({ top: 0, left: 0 })
  const pickerRef = useRef<HTMLDivElement>(null)
  const highlightButtonRef = useRef<HTMLButtonElement | null>(null)
  const tablePickerRef = useRef<HTMLDivElement>(null)
  const tableButtonRef = useRef<HTMLButtonElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Persist while the user types so content isn't lost on a refresh that
  // happens before the editor blurs. Passing the callback as an argument
  // keeps the debounced function stable while still flushing with the latest
  // handler.
  const debouncedSave = useMemo(
    () =>
      debounce(
        (html: string, callback: ((html: string) => void) | undefined) => {
          callback?.(html)
        },
        500,
      ),
    [],
  )

  // Flush any pending save on unmount so edits aren't lost on navigation.
  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [debouncedSave])

  const extensions = useMemo(() => buildEditorExtensions(placeholder), [
    placeholder,
  ])

  // Stable across renders so useEditor doesn't reapply the props each render.
  const editorProps = useMemo(
    () => ({
      attributes: {
        'aria-labelledby': labelId,
      },
      transformPastedHTML,
    }),
    [labelId],
  )

  const editor = useEditor({
    extensions,
    // Normalize on load so legacy content saved with inline styles is
    // converted to classes — the schema would silently drop the styles (and
    // with them the highlights and indentation) rather than migrate them.
    content: normalizeRichTextHtml(defaultValue ?? ''),
    editable: !disabled,
    // The page is server-rendered; the editor can only exist in the browser.
    immediatelyRender: false,
    editorProps,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
      if (!disabled) {
        debouncedSave(html, onDebouncedChange)
      }
    },
    onFocus: () => setFocused(true),
    onBlur: ({ editor }) => {
      setFocused(false)
      onBlur?.(editor.getHTML())
      // Blur already persisted; drop any pending debounced save.
      debouncedSave.cancel()
    },
  })

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [editor, disabled])

  // Sync externally-driven value changes (e.g. autofill regeneration) into
  // the editor. Editor-originated changes round-trip through onChange and
  // match getHTML(), so this only writes on genuinely external updates.
  // A focused editor is left alone so the user's typing isn't clobbered.
  useEffect(() => {
    if (
      !editor ||
      value === undefined ||
      editor.isFocused ||
      value === editor.getHTML()
    ) {
      return
    }
    editor.commands.setContent(normalizeRichTextHtml(value), {
      emitUpdate: false,
    })
  }, [value, editor])

  // The color at the caret drives the picker's selected swatch.
  const selectedColor = useEditorState({
    editor,
    selector: (ctx) =>
      (ctx.editor?.getAttributes('classHighlight').color as
        | string
        | undefined) ?? null,
  })

  // The table actions only apply while the caret is inside a table, so the
  // picker follows the caret out (e.g. after deleting the table or
  // arrowing past it).
  const inTable = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.isActive('table') ?? false,
  })

  useEffect(() => {
    if (!inTable) {
      setTablePickerOpen(false)
    }
  }, [inTable])

  useEffect(() => {
    if (!pickerOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      // The highlight button is excluded: React flushes this effect while the
      // opening mousedown is still bubbling towards the document, so without
      // the exclusion the picker would close in the same event that opened
      // it. The button's own handler does the toggling instead.
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        !highlightButtonRef.current?.contains(target)
      ) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [pickerOpen])

  useEffect(() => {
    if (!tablePickerOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      // Same button exclusion as the highlight picker: the toggling is left
      // to the button's own click handler.
      if (
        tablePickerRef.current &&
        !tablePickerRef.current.contains(target) &&
        !tableButtonRef.current?.contains(target)
      ) {
        setTablePickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [tablePickerOpen])

  // Escape leaves fullscreen; the page behind must not scroll while the
  // editor covers it.
  useEffect(() => {
    if (!fullscreen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  const toggleHighlightPicker = useCallback(() => {
    const wrapper = wrapperRef.current
    const button = wrapper?.querySelector<HTMLButtonElement>(
      '[aria-label="Highlight"]',
    )
    highlightButtonRef.current = button ?? null
    if (wrapper && button) {
      // Both the wrapper (position: relative) and the button live in this
      // component, so the picker is anchored with plain offset math.
      const wrapperRect = wrapper.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      setPickerPos({
        top: buttonRect.bottom - wrapperRect.top + 4,
        left: buttonRect.left - wrapperRect.left,
      })
    }
    setPickerOpen((open) => !open)
  }, [])

  const toggleTablePicker = useCallback(() => {
    const wrapper = wrapperRef.current
    const button = wrapper?.querySelector<HTMLButtonElement>(
      '[aria-label="Table"]',
    )
    tableButtonRef.current = button ?? null
    if (wrapper && button) {
      const wrapperRect = wrapper.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      setTablePickerPos({
        top: buttonRect.bottom - wrapperRect.top + 4,
        left: buttonRect.left - wrapperRect.left,
      })
    }
    setTablePickerOpen((open) => !open)
  }, [])

  const runTableAction = useCallback(
    (action: TableAction) => {
      const chain = editor?.chain().focus()
      switch (action) {
        case 'addRowBefore':
          chain?.addRowBefore().run()
          break
        case 'addRowAfter':
          chain?.addRowAfter().run()
          break
        case 'deleteRow':
          chain?.deleteRow().run()
          break
        case 'addColumnBefore':
          chain?.addColumnBefore().run()
          break
        case 'addColumnAfter':
          chain?.addColumnAfter().run()
          break
        case 'deleteColumn':
          chain?.deleteColumn().run()
          break
        case 'deleteTable':
          chain?.deleteTable().run()
          break
      }
      // The panel stays open for repeated row/column edits; deleting the
      // table moves the caret out of it, which closes the panel through the
      // inTable effect above.
    },
    [editor],
  )

  return (
    <div data-testid={dataTestId}>
      <div
        ref={wrapperRef}
        className={cn(styles.wrapper, {
          [styles.wrapperDisabled]: disabled,
          [styles.wrapperError]: Boolean(errorMessage),
          [styles.wrapperFocused]: focused,
          [styles.wrapperFullscreen]: fullscreen,
        })}
      >
        <label
          id={labelId}
          className={cn(styles.label, {
            [styles.labelError]: Boolean(errorMessage),
            [styles.labelDisabled]: disabled,
          })}
        >
          {`${label} `}
          {required && <RequiredStar />}
        </label>
        {!disabled && (
          <Toolbar
            editor={editor}
            highlightPickerOpen={pickerOpen}
            onToggleHighlightPicker={toggleHighlightPicker}
            tablePickerOpen={tablePickerOpen}
            onToggleTablePicker={toggleTablePicker}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen((current) => !current)}
          />
        )}
        <div
          className={cn(styles.editorArea, {
            [styles.editorAreaFullscreen]: fullscreen,
            [styles.editorAreaDisabled]: disabled,
          })}
          style={fullscreen ? undefined : { height: height - TOOLBAR_HEIGHT }}
        >
          <EditorContent editor={editor} className={styles.content} />
        </div>
        <AnimatePresence>
          {pickerOpen && (
            <HighlightColorPicker
              ref={pickerRef}
              position={pickerPos}
              selectedColor={selectedColor}
              onSelectColor={(color) => {
                editor?.chain().focus().setClassHighlight(color).run()
                setPickerOpen(false)
              }}
              onRemoveColor={() => {
                editor?.chain().focus().unsetClassHighlight().run()
                setPickerOpen(false)
              }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {tablePickerOpen && (
            <TableActionPicker
              ref={tablePickerRef}
              position={tablePickerPos}
              onAction={runTableAction}
            />
          )}
        </AnimatePresence>
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  )
}

export default RichTextEditor
