import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
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
import Toolbar from './Toolbar'
import * as styles from './RichTextEditor.css'

// The toolbar row the height prop has to account for, so a given height
// yields roughly the same content area as the previous editor did.
const TOOLBAR_HEIGHT = 42

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
  const pickerRef = useRef<HTMLDivElement>(null)
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

  const extensions = useMemo(
    () => buildEditorExtensions(placeholder),
    [placeholder],
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
    editorProps: {
      attributes: {
        'aria-labelledby': labelId,
      },
      // Everything pasted from outside the editor is raw clipboard HTML
      // (Word, Google Docs, ...) and goes through artifact removal, fake-list
      // conversion and style-to-class normalization before the schema parses
      // it. Editor-internal pastes (marked data-pm-slice) are already
      // schema-clean.
      transformPastedHTML: (html) =>
        html.includes('data-pm-slice') ? html : normalizePastedHtml(html),
    },
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

  useEffect(() => {
    if (!pickerOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (pickerRef.current && !pickerRef.current.contains(target)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [pickerOpen])

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
    const button = wrapper?.querySelector<HTMLElement>(
      '[aria-label="Highlight"]',
    )
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
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  )
}

export default RichTextEditor
