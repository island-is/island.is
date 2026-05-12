import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Editor } from '@tinymce/tinymce-react'

import { theme } from '@island.is/island-ui/theme'

import * as styles from './TinyMCE.css'

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

const HIGHLIGHT_COLORS = [
  { label: 'Yellow', color: theme.color.yellow400 },
  { label: 'Blue', color: theme.color.blue100 },
  { label: 'Mint', color: theme.color.mint200 },
  { label: 'Rose', color: theme.color.roseTinted200 },
  { label: 'Purple', color: theme.color.purple200 },
]

const containerVariants = {
  hidden: { opacity: 0, scale: 0.92, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: 'easeOut' as const,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -6,
    transition: { duration: 0.12, ease: 'easeIn' as const },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.12 } },
}

interface Props {
  label: string
}

const TinyMCE = ({ label }: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 })
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const highlightBtnApiRef = useRef<any>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    highlightBtnApiRef.current?.setActive(pickerOpen)
  }, [pickerOpen])

  useEffect(() => {
    if (!pickerOpen) return
    const close = () => setPickerOpen(false)
    const handleMouseDown = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
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

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <Editor
        apiKey={process.env.TINY_MCE_API_KEY}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInit={(_: any, editor: any) => {
          editorRef.current = editor
        }}
        init={{
          plugins: 'lists fullscreen',
          toolbar: 'bold italic | indent outdent | highlightcolor | fullscreen',
          toolbar_mode: 'wrap',
          menubar: false,
          setup: (editor) => {
            editor.on('NodeChange', (e) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let node: any = e.element
              while (node && node !== editor.getBody()) {
                if (node.nodeType === 1) {
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
                }
                node = node.parentNode
              }
              setSelectedColor(null)
            })

            editor.ui.registry.addToggleButton('highlightcolor', {
              icon: 'highlight-bg-color',
              onAction: (api) => {
                highlightBtnApiRef.current = api
                const container = editor.getContainer()
                // Toolbar groups: [0]=bold+italic [1]=indent+outdent [2]=highlightcolor [3]=fullscreen
                const groups = container.querySelectorAll<HTMLElement>(
                  '.tox-toolbar__group',
                )
                const group = groups[2]
                if (group) {
                  const rect = group.getBoundingClientRect()
                  setPickerPos({ top: rect.bottom + 4, left: rect.left })
                }
                setPickerOpen((open) => !open)
              },
              onSetup: (api) => {
                highlightBtnApiRef.current = api
                return () => undefined
              },
            })
          },
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,700;1,300;1,700&display=swap'); body { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 300; } strong, b { font-weight: 700; }",
          branding: false,
          statusbar: false,
          placeholder: 'Start typing...',
        }}
        initialValue=""
        onEditorChange={(content) => console.log(content)}
      />
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            ref={pickerRef}
            className={styles.colorPicker}
            style={{ top: pickerPos.top, left: pickerPos.left }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {HIGHLIGHT_COLORS.map(({ label: colorLabel, color }) => (
              <motion.button
                key={color}
                type="button"
                className={`${styles.colorSwatch}${
                  selectedColor === color
                    ? ` ${styles.colorSwatchSelected}`
                    : ''
                }`}
                style={{ background: color }}
                aria-label={colorLabel}
                variants={itemVariants}
                onMouseDown={(e) => {
                  e.preventDefault()
                  editorRef.current?.execCommand('HiliteColor', false, color)
                  setSelectedColor(color)
                  setPickerOpen(false)
                }}
              />
            ))}
            <motion.button
              type="button"
              className={styles.removeColor}
              aria-label="Remove highlight"
              variants={itemVariants}
              onMouseDown={(e) => {
                e.preventDefault()
                editorRef.current?.execCommand(
                  'HiliteColor',
                  false,
                  'transparent',
                )
                setSelectedColor(null)
                setPickerOpen(false)
              }}
            >
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TinyMCE
