import type { FC } from 'react'
import { forwardRef } from 'react'
import { motion } from 'motion/react'

import * as styles from './TableActionPicker.css'

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

// Hand-drawn 24x24 glyphs, like the toolbar's: the bars are the kept
// rows/columns, the +/− marks where the operation applies.
const AddRowBeforeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="11" y="2.5" width="2" height="7" />
      <rect x="8.5" y="5" width="7" height="2" />
      <rect x="4" y="11.5" width="16" height="4" rx="1" />
      <rect x="4" y="17.5" width="16" height="4" rx="1" />
    </g>
  </svg>
)

const AddRowAfterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="4" y="2.5" width="16" height="4" rx="1" />
      <rect x="4" y="8.5" width="16" height="4" rx="1" />
      <rect x="11" y="14.5" width="2" height="7" />
      <rect x="8.5" y="17" width="7" height="2" />
    </g>
  </svg>
)

const DeleteRowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="4" y="3.5" width="16" height="4" rx="1" />
      <rect x="4" y="16.5" width="16" height="4" rx="1" />
      <rect x="7.5" y="11" width="9" height="2" />
    </g>
  </svg>
)

const AddColumnBeforeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="2.5" y="11" width="7" height="2" />
      <rect x="5" y="8.5" width="2" height="7" />
      <rect x="11.5" y="4" width="4" height="16" rx="1" />
      <rect x="17.5" y="4" width="4" height="16" rx="1" />
    </g>
  </svg>
)

const AddColumnAfterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="2.5" y="4" width="4" height="16" rx="1" />
      <rect x="8.5" y="4" width="4" height="16" rx="1" />
      <rect x="14.5" y="11" width="7" height="2" />
      <rect x="17" y="8.5" width="2" height="7" />
    </g>
  </svg>
)

const DeleteColumnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor">
      <rect x="3.5" y="4" width="4" height="16" rx="1" />
      <rect x="16.5" y="4" width="4" height="16" rx="1" />
      <rect x="11" y="7.5" width="2" height="9" />
    </g>
  </svg>
)

// A square box with a symmetric ✕ (a 45°-tilted +) centered inside it, the
// same mark the highlight picker uses for its remove button.
const DeleteTableIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      d="M4 4h16v16H4V4Zm4.5 4.5l7 7m0-7l-7 7"
    />
  </svg>
)

export type TableAction =
  | 'addRowBefore'
  | 'addRowAfter'
  | 'deleteRow'
  | 'addColumnBefore'
  | 'addColumnAfter'
  | 'deleteColumn'
  | 'deleteTable'

// Additions on the top row, deletions below. The labels double as visible
// tooltips (title), so they are user-facing Icelandic.
const ACTIONS: {
  action: TableAction
  label: string
  icon: FC
}[] = [
  {
    action: 'addRowBefore',
    label: 'Bæta við röð fyrir ofan',
    icon: AddRowBeforeIcon,
  },
  {
    action: 'addRowAfter',
    label: 'Bæta við röð fyrir neðan',
    icon: AddRowAfterIcon,
  },
  {
    action: 'addColumnBefore',
    label: 'Bæta við dálki vinstra megin',
    icon: AddColumnBeforeIcon,
  },
  {
    action: 'addColumnAfter',
    label: 'Bæta við dálki hægra megin',
    icon: AddColumnAfterIcon,
  },
  { action: 'deleteRow', label: 'Eyða röð', icon: DeleteRowIcon },
  { action: 'deleteColumn', label: 'Eyða dálki', icon: DeleteColumnIcon },
  { action: 'deleteTable', label: 'Eyða töflu', icon: DeleteTableIcon },
]

type Props = {
  position: { top: number; left: number }
  onAction: (action: TableAction) => void
}

// The table counterpart of HighlightColorPicker: a small grid anchored under
// the toolbar's table button, shown while the caret is inside a table.
const TableActionPicker = forwardRef<HTMLDivElement, Props>(
  ({ position, onAction }, ref) => (
    <motion.div
      ref={ref}
      className={styles.actionPicker}
      style={{ top: position.top, left: position.left }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {ACTIONS.map(({ action, label, icon: Icon }) => (
        <motion.button
          key={action}
          type="button"
          className={styles.actionButton}
          aria-label={label}
          title={label}
          variants={itemVariants}
          // Mousedown is prevented so the editor selection and focus survive
          // the press; the action runs on click so keyboard activation works.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onAction(action)}
        >
          <Icon />
        </motion.button>
      ))}
    </motion.div>
  ),
)

export default TableActionPicker
