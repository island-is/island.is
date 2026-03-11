import {
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { FieldTypesEnum } from '@island.is/form-system/ui'
import { useContext } from 'react'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { hasDependency } from './dependencyHelper'

type DndAction =
  | 'SECTION_OVER_SECTION'
  | 'SCREEN_OVER_SECTION'
  | 'SCREEN_OVER_SCREEN'
  | 'FIELD_OVER_SCREEN'
  | 'FIELD_OVER_FIELD'

export const useNavbarDnD = () => {
  const { controlDispatch, updateDnD, control, formUpdate } = useContext(
    ControlContext,
  ) as IControlContext
  const { activeItem, form, isPublished } = control
  const { dependencies } = form

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const noopDragStart = (_event: DragStartEvent) => {
    return
  }

  const noopDragOver = (_event: DragOverEvent) => {
    return
  }

  const noopDragEnd = () => {
    return
  }

  const onDragStart = isPublished
    ? noopDragStart
    : (event: DragStartEvent) => {
    controlDispatch({
      type: 'SET_ACTIVE_ITEM',
      payload: {
        activeItem: {
          type: event.active.data.current?.type,
          data: event.active.data.current?.data ?? null,
        },
      },
    })
    }

  const onDragOver = isPublished
    ? noopDragOver
    : (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeSection = active.data?.current?.type === 'Section'
    const activeScreen = active.data?.current?.type === 'Screen'
    const activeField = active.data?.current?.type === 'Field'
    const overSection = over.data?.current?.type === 'Section'
    const overScreen = over.data?.current?.type === 'Screen'
    const overField = over.data?.current?.type === 'Field'

    const dispatchDragAction = (type: DndAction) =>
      controlDispatch({ type, payload: { activeId, overId } })

    if (activeSection && overSection) {
      dispatchDragAction('SECTION_OVER_SECTION')
    }

    if (activeScreen) {
      if (overSection) {
        dispatchDragAction('SCREEN_OVER_SECTION')
      }
      if (overScreen) {
        dispatchDragAction('SCREEN_OVER_SCREEN')
      }
    }

    if (activeField) {
      if (overScreen) {
        dispatchDragAction('FIELD_OVER_SCREEN')
      }
      if (overField) {
        dispatchDragAction('FIELD_OVER_FIELD')
      }
    }

    if (hasDependency(dependencies, activeId as string)) {
      controlDispatch({
        type: 'REMOVE_DEPENDENCIES',
        payload: { activeId, update: formUpdate },
      })
    }

    if (activeField) {
      const fieldItem = form.fields?.find((field) => field?.id === activeId)
      if (fieldItem) {
        if (
          fieldItem.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
          fieldItem.fieldType === FieldTypesEnum.RADIO_BUTTONS
        ) {
          controlDispatch({
            type: 'REMOVE_LIST_DEPENDENCIES',
            payload: { field: fieldItem, update: formUpdate },
          })
        }
      }
    }
    }

  const onDragEnd = isPublished ? noopDragEnd : () => updateDnD(activeItem.type)

  return {
    sensors: isPublished ? [] : sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
  }
}
