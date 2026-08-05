import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { FormSystemForm } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'
import { useContext, useRef, useState } from 'react'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { hasDependency } from './dependencyHelper'
import { moveNavbarItem, NavbarDrop } from './moveNavbarItem'

export const useNavbarDnD = () => {
  const { controlDispatch, updateDnD, control, formUpdate, setOpenComponents } =
    useContext(ControlContext) as IControlContext

  const { form, isReadOnly } = control
  const { dependencies } = form

  const [isDraggingNavbarItem, setIsDraggingNavbarItem] = useState(false)
  const [activeDragType, setActiveDragType] = useState<string | null>(null)
  const [pendingDropId, setPendingDropId] = useState<string | null>(null)

  const pendingDropRef = useRef<NavbarDrop | null>(null)
  const lastPendingDropKeyRef = useRef<string | null>(null)

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

  const noopDragEnd = (_event?: DragEndEvent) => {
    return
  }

  const resetDragState = () => {
    pendingDropRef.current = null
    lastPendingDropKeyRef.current = null
    setPendingDropId(null)
    setActiveDragType(null)
    setIsDraggingNavbarItem(false)
  }

  const resolveDrop = (
    activeType: string | undefined,
    overType: string | undefined,
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    overData?: { id?: string },
  ): NavbarDrop | null => {
    if (!activeType || !overType) {
      return null
    }

    const normalizedOverId = overData?.id ?? String(overId)

    if (activeType === 'Section' && overType === 'Section') {
      return {
        activeType,
        overType,
        activeId: String(activeId),
        overId: normalizedOverId,
      }
    }

    if (
      activeType === 'Screen' &&
      (overType === 'Section' ||
        overType === 'Screen' ||
        overType === 'ClosedSection')
    ) {
      return {
        activeType,
        overType,
        activeId: String(activeId),
        overId: normalizedOverId,
      }
    }

    if (
      activeType === 'Field' &&
      (overType === 'Screen' ||
        overType === 'Field' ||
        overType === 'ClosedScreen')
    ) {
      return {
        activeType,
        overType,
        activeId: String(activeId),
        overId: normalizedOverId,
      }
    }

    return null
  }

  const openDroppedIntoContainer = (
    updatedForm: FormSystemForm,
    drop: NavbarDrop,
  ) => {
    setOpenComponents((prev) => {
      if (drop.activeType === 'Field') {
        if (drop.overType === 'Screen' || drop.overType === 'ClosedScreen') {
          return {
            ...prev,
            screens: prev.screens.includes(drop.overId)
              ? prev.screens
              : [...prev.screens, drop.overId],
          }
        }

        if (drop.overType === 'Field') {
          const targetField = updatedForm.fields?.find(
            (field) => field?.id === drop.overId,
          )

          if (
            !targetField?.screenId ||
            prev.screens.includes(targetField.screenId)
          ) {
            return prev
          }

          return {
            ...prev,
            screens: [...prev.screens, targetField.screenId],
          }
        }
      }

      if (drop.activeType === 'Screen') {
        if (drop.overType === 'Section' || drop.overType === 'ClosedSection') {
          return {
            ...prev,
            sections: prev.sections.includes(drop.overId)
              ? prev.sections
              : [...prev.sections, drop.overId],
          }
        }

        if (drop.overType === 'Screen') {
          const targetScreen = updatedForm.screens?.find(
            (screen) => screen?.id === drop.overId,
          )

          if (
            !targetScreen?.sectionId ||
            prev.sections.includes(targetScreen.sectionId)
          ) {
            return prev
          }

          return {
            ...prev,
            sections: [...prev.sections, targetScreen.sectionId],
          }
        }
      }

      return prev
    })
  }

  const keepDroppedItemActive = (
    updatedForm: FormSystemForm,
    drop: NavbarDrop,
  ) => {
    if (drop.activeType === 'Field') {
      const field = updatedForm.fields?.find(
        (field) => field?.id === drop.activeId,
      )

      if (!field) {
        return
      }

      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Field',
            data: field,
          },
        },
      })

      return
    }

    if (drop.activeType === 'Screen') {
      const screen = updatedForm.screens?.find(
        (screen) => screen?.id === drop.activeId,
      )

      if (!screen) {
        return
      }

      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Screen',
            data: screen,
          },
        },
      })

      return
    }

    if (drop.activeType === 'Section') {
      const section = updatedForm.sections?.find(
        (section) => section?.id === drop.activeId,
      )

      if (!section) {
        return
      }

      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Section',
            data: section,
          },
        },
      })
    }
  }

  const cleanupDependenciesAfterDrop = (
    activeId: UniqueIdentifier,
    activeType: string | undefined,
  ) => {
    if (hasDependency(dependencies, activeId as string)) {
      controlDispatch({
        type: 'REMOVE_DEPENDENCIES',
        payload: { activeId, update: formUpdate },
      })
    }

    if (activeType !== 'Field') {
      return
    }

    const fieldItem = form.fields?.find((field) => field?.id === activeId)

    if (
      fieldItem &&
      (fieldItem.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
        fieldItem.fieldType === FieldTypesEnum.RADIO_BUTTONS)
    ) {
      controlDispatch({
        type: 'REMOVE_LIST_DEPENDENCIES',
        payload: { field: fieldItem, update: formUpdate },
      })
    }
  }

  const onDragStart = isReadOnly
    ? noopDragStart
    : (event: DragStartEvent) => {
        const dragType = event.active.data.current?.type ?? null

        setActiveDragType(dragType)
        setIsDraggingNavbarItem(true)

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

  const onDragOver = isReadOnly
    ? noopDragOver
    : (event: DragOverEvent) => {
        const { active, over } = event

        if (!over) {
          pendingDropRef.current = null
          lastPendingDropKeyRef.current = null
          setPendingDropId(null)
          return
        }

        const drop = resolveDrop(
          active.data.current?.type,
          over.data.current?.type,
          active.id,
          over.id,
          over.data.current?.data,
        )

        if (!drop) {
          pendingDropRef.current = null
          lastPendingDropKeyRef.current = null
          setPendingDropId(null)
          return
        }

        const dropKey = `${drop.activeType}:${drop.activeId}:${drop.overType}:${drop.overId}`

        if (lastPendingDropKeyRef.current === dropKey) {
          return
        }

        lastPendingDropKeyRef.current = dropKey
        pendingDropRef.current = drop
        setPendingDropId(drop.overId)
      }

  const onDragEnd = isReadOnly
    ? noopDragEnd
    : (event: DragEndEvent) => {
        const drop = pendingDropRef.current

        if (!event.over || !drop) {
          resetDragState()
          return
        }

        const updatedForm = moveNavbarItem(control.form, drop)

        controlDispatch({
          type: 'SET_FORM',
          payload: {
            form: updatedForm,
          },
        })

        openDroppedIntoContainer(updatedForm, drop)
        keepDroppedItemActive(updatedForm, drop)

        cleanupDependenciesAfterDrop(
          event.active.id,
          event.active.data.current?.type,
        )

        updateDnD(updatedForm)
        resetDragState()
      }

  const onDragCancel = isReadOnly ? noopDragEnd : resetDragState

  return {
    sensors: isReadOnly ? [] : sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    isDraggingNavbarItem,
    activeDragType,
    pendingDropId,
  }
}
