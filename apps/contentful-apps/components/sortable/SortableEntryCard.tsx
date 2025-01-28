import {
  DragHandle,
  EntryCard,
  type EntryCardProps,
} from '@contentful/f36-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SortableEntryCardProps = EntryCardProps & {
  id: string
}

export const SortableEntryCard = (props: SortableEntryCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div key={props.id} ref={setNodeRef} style={style} {...attributes}>
      <EntryCard
        {...props}
        withDragHandle
        dragHandleRender={() => (
          <DragHandle {...listeners} label="Drag handle" />
        )}
      />
    </div>
  )
}
