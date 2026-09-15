import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle, Stack, Text } from '@contentful/f36-components'

/* Forma 36's own handle rather than a hand-rolled button: it already renders an
 * accessible `<button>` with a screen-reader-only label and the active/focused
 * styling, which is exactly what dnd-kit's listeners need to hang off. */
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
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </Stack>
  )
}

/* `SortableContext` alone gives an empty list no droppable target, so a section
 * emptied of fields could never receive one back. */
export const EmptyDropZone = ({ id, label }: { id: string; label: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      /* Hover is signalled by border STYLE rather than a new colour, so this
       * introduces no palette value the rest of the app does not already use. */
      style={{
        border: `1px ${isOver ? 'solid' : 'dashed'} #d3dce0`,
        borderRadius: 4,
        padding: 12,
        textAlign: 'center',
      }}
    >
      <Text fontColor="gray500" fontSize="fontSizeS">
        {label}
      </Text>
    </div>
  )
}
