import React, { forwardRef } from 'react'
import { motion } from 'motion/react'

import { HIGHLIGHT_COLORS } from './pasteNormalization'
import * as styles from './TinyMCE.css'

export { HIGHLIGHT_COLORS }

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

type Props = {
  position: { top: number; left: number }
  selectedColor: string | null
  onSelectColor: (color: string) => void
  onRemoveColor: () => void
}

const HighlightColorPicker = forwardRef<HTMLDivElement, Props>(
  ({ position, selectedColor, onSelectColor, onRemoveColor }, ref) => (
    <motion.div
      ref={ref}
      className={styles.colorPicker}
      style={{ top: position.top, left: position.left }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {HIGHLIGHT_COLORS.map(({ label, color }) => (
        <motion.button
          key={color}
          type="button"
          className={`${styles.colorSwatch}${
            selectedColor === color ? ` ${styles.colorSwatchSelected}` : ''
          }`}
          style={{ background: color }}
          aria-label={label}
          variants={itemVariants}
          onMouseDown={(e) => {
            e.preventDefault()
            onSelectColor(color)
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
          onRemoveColor()
        }}
      >
        ✕
      </motion.button>
    </motion.div>
  ),
)

export default HighlightColorPicker
