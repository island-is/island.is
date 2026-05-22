import React, { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { Editor as TinyMCEEditor, Ui } from 'tinymce'
import { Editor } from '@tinymce/tinymce-react'

import { ErrorMessage } from '@island.is/island-ui/core'

import RequiredStar from '../RequiredStar/RequiredStar'
import HighlightColorPicker, { HIGHLIGHT_COLORS } from './HighlightColorPicker'
import * as styles from './TinyMCE.css'

type ToolbarToggleButtonInstanceApi = Ui.Toolbar.ToolbarToggleButtonInstanceApi

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

const parseCssColor = (cssColor: string): [number, number, number] | null => {
  const rgb = cssColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]]
  const hex6 = cssColor.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex6)
    return [parseInt(hex6[1], 16), parseInt(hex6[2], 16), parseInt(hex6[3], 16)]
  const hex3 = cssColor.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (hex3)
    return [
      parseInt(hex3[1] + hex3[1], 16),
      parseInt(hex3[2] + hex3[2], 16),
      parseInt(hex3[3] + hex3[3], 16),
    ]
  return null
}

const HIGHLIGHT_DISTANCE_THRESHOLD = 200

// Indent step (px) used by TinyMCE's indent/outdent buttons. Word paste uses
// margin-left in pt, which the buttons can't outdent, so we normalize it to
// padding-left rounded to this step (which the backend PDF also reads).
const INDENT_STEP_PX = 40

const normalizePastedIndentation = (html: string): string =>
  html.replace(
    /margin-left:\s*([\d.]+)(pt|px)\s*;?/g,
    (_match: string, value: string, unit: string) => {
      const numeric = parseFloat(value)
      const px = unit === 'pt' ? numeric * (96 / 72) : numeric
      const levels = Math.round(px / INDENT_STEP_PX)
      return levels > 0 ? `padding-left: ${levels * INDENT_STEP_PX}px;` : ''
    },
  )

const findNearestHighlightColor = (cssColor: string): string => {
  const fallback = HIGHLIGHT_COLORS[0].color
  const rgb = parseCssColor(cssColor)
  if (!rgb) return fallback

  let minDist = Infinity
  let nearest = fallback

  for (const { color } of HIGHLIGHT_COLORS) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const dist = Math.sqrt(
      (rgb[0] - r) ** 2 + (rgb[1] - g) ** 2 + (rgb[2] - b) ** 2,
    )
    if (dist < minDist) {
      minDist = dist
      nearest = color
    }
  }

  return minDist <= HIGHLIGHT_DISTANCE_THRESHOLD ? nearest : fallback
}

interface Props {
  label: string
  placeholder: string
  defaultValue?: string
  onChange?: (html: string) => void
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
  const initialValueRef = useRef(defaultValue ?? '')
  const editorRef = useRef<TinyMCEEditor | null>(null)
  const highlightBtnApiRef = useRef<ToolbarToggleButtonInstanceApi | null>(null)
  const pickerRef = useRef<HTMLDivElement>(null)
  const highlightGroupRef = useRef<HTMLElement | null>(null)

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
      let node: HTMLElement | null = e.element as HTMLElement
      while (node && node !== editor.getBody()) {
        const bg: string = node.style?.backgroundColor ?? ''
        if (bg && bg !== 'transparent') {
          const match = HIGHLIGHT_COLORS.find(
            ({ color }) => hexToRgb(color) === bg,
          )
          if (match) {
            setSelectedColor(match.color)
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
            toolbar: 'bold italic indent outdent highlightcolor fullscreen',
            indentation: `${INDENT_STEP_PX}px`,
            toolbar_mode: 'wrap',
            menubar: false,
            setup: (editor) => {
              editor.on('focus', () => setFocused(true))
              editor.on('blur', () => {
                setFocused(false)
                onBlur?.(editor.getContent())
              })
              editor.on('NodeChange', handleNodeChange(editor))
              editor.on('PastePreProcess', (args) => {
                // Normalize pasted backgrounds to a known highlight color, and
                // strip ones we can't parse (e.g. Word's "transparent"), which
                // would otherwise render as a black rectangle in the PDF.
                args.content = args.content.replace(
                  /background(-color)?:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|[a-zA-Z]+)\s*;?/g,
                  (_match: string, _shorthand: string, color: string) =>
                    parseCssColor(color)
                      ? `background-color: ${findNearestHighlightColor(color)};`
                      : '',
                )
                args.content = normalizePastedIndentation(args.content)
              })
              setupHighlightButton(editor)
            },
            paste_word_valid_elements: 'p,b,strong,i,em,span,br',
            paste_retain_style_properties:
              'font-weight,font-style,background-color,margin-left,padding-left',
            paste_strip_class_attributes: 'all',
            content_style:
              "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,700;1,300;1,700&display=swap'); body { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 300; } strong, b { font-weight: 700; } p { margin: 0; }",
            branding: false,
            statusbar: false,
            placeholder,
          }}
          initialValue={initialValueRef.current}
          onEditorChange={(content) => {
            console.log('TinyMCE HTML:', content)
            onChange?.(content)
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
                editorRef.current?.execCommand('HiliteColor', false, color)
                setSelectedColor(color)
                setPickerOpen(false)
              }}
              onRemoveColor={() => {
                if (selectedColor) {
                  editorRef.current?.execCommand(
                    'HiliteColor',
                    false,
                    selectedColor,
                  )
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
