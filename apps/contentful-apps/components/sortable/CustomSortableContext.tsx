import type { ReactNode } from 'react'
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface Item {
  id: string
}

interface SortableComponentListProps {
  items: Item[]
  updateItems: (updatedItems: Item[]) => void
  renderItem: (item: Item) => ReactNode
  containerClassName: string
}

export const CustomSortableContext = ({
  items,
  renderItem,
  updateItems,
  containerClassName,
}: SortableComponentListProps) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      if (oldIndex >= 0 && newIndex >= 0) {
        updateItems(arrayMove(items, oldIndex, newIndex))
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className={containerClassName}>{items.map(renderItem)}</div>
      </SortableContext>
    </DndContext>
  )
}
