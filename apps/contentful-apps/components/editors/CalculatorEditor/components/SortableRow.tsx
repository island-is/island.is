import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle, Stack, Text } from '@contentful/f36-components'
import * as styles from './CalculatorEditor.css'

/* Uses Forma 36's accessible drag handle. */
export const SortableRow = ({
  id,
  label,
  isDisabled,
  children,
}: {
  id: string
  label: string
  isDisabled?: boolean
  children: ReactNode
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDisabled })

  return (
    <Stack
      ref={setNodeRef}
      flexDirection="row"
      alignItems="flex-start"
      spacing="spacingXs"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {!isDisabled && (
        <DragHandle
          as="button"
          label={label}
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        />
      )}
      <div className={styles.sortableContent}>{children}</div>
    </Stack>
  )
}

/* Keeps empty sections droppable. */
export const EmptyDropZone = ({ id, label }: { id: string; label: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`${styles.emptyDropZone[isOver ? 'active' : 'idle']} ${styles.emptyDropZoneContent}`}
    >
      <Text fontColor="gray500" fontSize="fontSizeS">
        {label}
      </Text>
    </div>
  )
}
