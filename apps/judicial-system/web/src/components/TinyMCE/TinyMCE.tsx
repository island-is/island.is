import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import { AnimatePresence } from 'motion/react'
import type { Editor as TinyMCEEditor, Ui } from 'tinymce'
import { Editor } from '@tinymce/tinymce-react'

import { ErrorMessage } from '@island.is/island-ui/core'

import RequiredStar from '../RequiredStar/RequiredStar'
import HighlightColorPicker from './HighlightColorPicker'
import {
  colorFromHighlightClass,
  highlightClassFromColor,
  INDENT_STEP_PX,
  indentClassFromLevel,
  levelFromIndentClass,
  MAX_INDENT_LEVEL,
  normalizeRichTextHtml,
  WORD_HIGHLIGHT_COLORS,
} from './richTextNormalization'
import * as styles from './TinyMCE.css'

type ToolbarToggleButtonInstanceApi = Ui.Toolbar.ToolbarToggleButtonInstanceApi

// All formatting is class-based (see richTextNormalization.ts): the WAF in
// front of the API blocks any request body containing a style="..." attribute,
// so the editor must never emit inline styles. These rules make the classes
// render inside the editor iframe.
const CLASS_CONTENT_STYLE = [
  ...WORD_HIGHLIGHT_COLORS.map(
    ({ color }) =>
      `.${highlightClassFromColor(color)} { background-color: ${color}; }`,
  ),
  ...Array.from(
    { length: MAX_INDENT_LEVEL },
    (_, i) =>
      `p.${indentClassFromLevel(i + 1)} { padding-left: ${
        (i + 1) * INDENT_STEP_PX
      }px; }`,
  ),
].join(' ')

const HIGHLIGHT_FORMAT = 'classhighlight'

// The formatter substitutes %value into class names on apply/match/remove,
// so one format covers the whole palette (vars = hex without the '#').
const removeHighlight = (editor: TinyMCEEditor) => {
  WORD_HIGHLIGHT_COLORS.forEach(({ color }) =>
    editor.formatter.remove(HIGHLIGHT_FORMAT, { value: color.slice(1) }),
  )
}

const applyHighlight = (editor: TinyMCEEditor, color: string) => {
  editor.undoManager.transact(() => {
    // Remove any existing highlight first — applying a class format on top of
    // another would stack both classes on the same span.
    removeHighlight(editor)
    editor.formatter.apply(HIGHLIGHT_FORMAT, { value: color.slice(1) })
  })
  editor.nodeChanged()
}

const getIndentLevel = (block: Element): number => {
  for (const className of Array.from(block.classList)) {
    const level = levelFromIndentClass(className)
    if (level !== null) return level
  }
  return 0
}

interface Props {
  label: string
  placeholder: string
  defaultValue?: string
  onChange?: (html: string) => void
  onDebouncedChange?: (html: string) => void
  onBlur?: (html: string) => void
  disabled?: boolean
  errorMessage?: string
  required?: boolean
  'data-testid'?: string
}

const TinyMCE = ({
  label,
  placeholder,
  defaultValue,
  onChange,
  onDebouncedChange,
  onBlur,
  disabled,
  errorMessage,
  required,
  'data-testid': dataTestId,
}: Props) => {
  const editorId = useId()
  const [focused, setFocused] = useState<boolean>(false)
  const [pickerOpen, setPickerOpen] = useState<boolean>(false)
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  // Normalize on load so legacy content saved with inline styles is converted
  // to classes and saves cleanly from then on.
  const initialValueRef = useRef(normalizeRichTextHtml(defaultValue ?? ''))
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const highlightBtnApiRef = useRef<ToolbarToggleButtonInstanceApi | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const highlightGroupRef = useRef<HTMLElement | null>(null)

  // Persist while the user types so content isn't lost on a refresh that
  // happens before the editor blurs (TinyMCE's iframe doesn't reliably fire
  // blur on page unload). Passing the callback as an argument keeps the
  // debounced function stable while still flushing with the latest handler.
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

  useEffect(() => {
    highlightBtnApiRef.current?.setActive(pickerOpen)
  }, [pickerOpen])

  useEffect(() => {
    if (!pickerOpen) return
    const close = () => setPickerOpen(false)
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        !highlightGroupRef.current?.contains(target)
      ) {
        close()
      }
    }
    const iframeDoc = editorRef.current?.getDoc()
    document.addEventListener('mousedown', handleMouseDown)
    iframeDoc?.addEventListener('mousedown', close)
    window.addEventListener('scroll', close, { capture: true })
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      iframeDoc?.removeEventListener('mousedown', close)
      window.removeEventListener('scroll', close, { capture: true })
    }
  }, [pickerOpen])

  const handleNodeChange =
    (editor: TinyMCEEditor) => (e: { element: Element }) => {
      let node: Element | null = e.element
      while (node && node !== editor.getBody()) {
        for (const className of Array.from(node.classList)) {
          const color = colorFromHighlightClass(className)
          if (color) {
            setSelectedColor(color)
            return
          }
        }
        node = node.parentElement
      }
      setSelectedColor(null)
    }

  const setupHighlightButton = (editor: TinyMCEEditor) => {
    editor.ui.registry.addToggleButton('highlightcolor', {
      icon: 'highlight-bg-color',
      tooltip: 'Highlight',
      onAction: (api) => {
        highlightBtnApiRef.current = api
        const container = editor.getContainer()
        const btn = container.querySelector<HTMLElement>(
          '[aria-label="Highlight"]',
        )
        if (btn) {
          highlightGroupRef.current = btn
          const rect = btn.getBoundingClientRect()
          setPickerPos({ top: rect.bottom + 4, left: rect.left })
        }
        setPickerOpen((open) => !open)
      },
      onSetup: (api) => {
        highlightBtnApiRef.current = api
        return () => undefined
      },
    })
  }

  // Class-based replacement for the built-in indent/outdent commands, which
  // apply inline padding-left styles that the WAF would reject.
  const setupIndentButtons = (editor: TinyMCEEditor) => {
    const changeIndent = (delta: number) => () => {
      const blocks = editor.selection.getSelectedBlocks()
      if (blocks.length === 0) return
      editor.undoManager.transact(() => {
        blocks.forEach((block) => {
          const current = getIndentLevel(block)
          const next = Math.min(MAX_INDENT_LEVEL, Math.max(0, current + delta))
          if (next === current) return
          if (current > 0) {
            editor.dom.removeClass(block, indentClassFromLevel(current))
          }
          if (next > 0) {
            editor.dom.addClass(block, indentClassFromLevel(next))
          }
        })
      })
      editor.nodeChanged()
    }
    editor.ui.registry.addButton('blockindent', {
      icon: 'indent',
      tooltip: 'Increase indent',
      onAction: changeIndent(1),
    })
    editor.ui.registry.addButton('blockoutdent', {
      icon: 'outdent',
      tooltip: 'Decrease indent',
      onAction: changeIndent(-1),
    })
  }

  return (
    <div data-testid={dataTestId}>
      <div
        className={[
          styles.wrapper,
          disabled && styles.wrapperDisabled,
          errorMessage && styles.wrapperError,
          focused && styles.wrapperFocused,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <label
          className={`${styles.label}${
            errorMessage ? ` ${styles.labelError}` : ''
          }${disabled ? ` ${styles.labelDisabled}` : ''}`}
          htmlFor={editorId}
        >
          {`${label} `}
          {required && <RequiredStar />}
        </label>
        <Editor
          id={editorId}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onInit={(_, editor) => {
            editorRef.current = editor
          }}
          init={{
            height: 450,
            plugins: 'lists fullscreen paste',
            toolbar:
              'bold italic blockindent blockoutdent highlightcolor fullscreen',
            toolbar_mode: 'wrap',
            menubar: false,
            formats: {
              [HIGHLIGHT_FORMAT]: {
                inline: 'span',
                classes: ['hl-%value'],
                links: true,
                remove_similar: true,
              },
            },
            setup: (editor) => {
              editor.on('focus', () => setFocused(true))
              editor.on('blur', () => {
                setFocused(false)
                onBlur?.(editor.getContent())
                // Blur already persisted; drop any pending debounced save.
                debouncedSave.cancel()
              })
              editor.on('NodeChange', handleNodeChange(editor))
              editor.on('PastePreProcess', (args) => {
                args.content = normalizeRichTextHtml(args.content)
              })
              setupHighlightButton(editor)
              setupIndentButtons(editor)
            },
            paste_word_valid_elements: 'p,b,strong,i,em,span,br',
            // "background" (shorthand) is required: Word highlights arrive as
            // "background:yellow" and the paste plugin also maps mso-highlight
            // to "background". These retained styles never reach the content —
            // PastePreProcess converts them all to classes/semantic tags and
            // strips every style attribute.
            paste_retain_style_properties:
              'font-weight,font-style,background,background-color,margin-left,padding-left',
            paste_strip_class_attributes: 'all',
            content_style:
              "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,700;1,300;1,700&display=swap'); body { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 300; } strong, b { font-weight: 700; } p { margin: 0; } " +
              CLASS_CONTENT_STYLE,
            branding: false,
            statusbar: false,
            placeholder,
          }}
          initialValue={initialValueRef.current}
          onEditorChange={(newContent) => {
            onChange?.(newContent)
            if (!disabled) {
              debouncedSave(newContent, onDebouncedChange)
            }
          }}
          disabled={disabled}
        />
        <AnimatePresence>
          {pickerOpen && (
            <HighlightColorPicker
              ref={pickerRef}
              position={pickerPos}
              selectedColor={selectedColor}
              onSelectColor={(color) => {
                if (editorRef.current) {
                  applyHighlight(editorRef.current, color)
                }
                setSelectedColor(color)
                setPickerOpen(false)
              }}
              onRemoveColor={() => {
                if (editorRef.current) {
                  editorRef.current.undoManager.transact(() => {
                    editorRef.current && removeHighlight(editorRef.current)
                  })
                  editorRef.current.nodeChanged()
                }
                setSelectedColor(null)
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

export default TinyMCE
