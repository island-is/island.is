import { useContext, useEffect, useMemo, useState } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'
import {
  FormSystemField,
  FormSystemListItem,
  Maybe,
} from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
  Button,
  Stack,
} from '@island.is/island-ui/core'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { NavbarSelectStatus } from '../../../../../../lib/utils/interfaces'
import { ListItem } from './components/ListItem'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import {
  CREATE_LIST_ITEM,
  UPDATE_LIST_ITEM,
  UPDATE_LIST_ITEM_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'
import { removeTypename } from '../../../../../../lib/utils/removeTypename'
import { m } from '@island.is/form-system/ui'

export const ListBuilder = () => {
  const [createListItem] = useMutation(CREATE_LIST_ITEM)
  const [updateListItemDisplayOrder] = useMutation(
    UPDATE_LIST_ITEM_DISPLAY_ORDER,
  )
  const [updateListItem] = useMutation(UPDATE_LIST_ITEM)
  const { control, controlDispatch, setSelectStatus, setInListBuilder } =
    useContext(ControlContext)
  const { isPublished } = control
  const currentItem = control.activeItem.data as FormSystemField
  const { activeListItem } = control
  const listItems = currentItem?.list ?? ([] as FormSystemListItem[])
  const listItemIds = useMemo(
    () =>
      listItems
        ?.filter(
          (l: Maybe<FormSystemListItem>): l is FormSystemListItem =>
            l !== null && l !== undefined,
        )
        .map((l: FormSystemListItem) => l?.id as UniqueIdentifier),
    [listItems],
  )
  const [connecting, setConnecting] = useState<boolean[]>(
    listItems.map(() => false),
  )

  const { formatMessage } = useIntl()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const addListItem = async () => {
    try {
      const newListItem = await createListItem({
        variables: {
          input: {
            createListItemDto: {
              fieldId: currentItem.id,
              displayOrder: listItems.length,
            },
          },
        },
      })
      controlDispatch({
        type: 'ADD_LIST_ITEM',
        payload: {
          newListItem: removeTypename(
            newListItem.data.createFormSystemListItem,
          ),
        },
      })
      setConnecting((prev) => [...prev, false])
    } catch (e) {
      console.error('Error creating list item:', e.message)
    }
  }

  const onDragStart = (event: DragStartEvent) => {
    controlDispatch({
      type: 'SET_ACTIVE_LIST_ITEM',
      payload: {
        listItem: event.active.data.current?.listItem,
      },
    })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return
    const activeId = active.id
    const overId = over.id
    controlDispatch({
      type: 'LIST_ITEM_OVER_LIST_ITEM',
      payload: {
        activeId: activeId,
        overId: overId,
      },
    })
  }

  const onDragEnd = () => {
    controlDispatch({
      type: 'SET_ACTIVE_LIST_ITEM',
      payload: {
        listItem: null,
      },
    })
    updateListItemDisplayOrder({
      variables: {
        input: {
          updateListItemsDisplayOrderDto: {
            listItemsDisplayOrderDto: listItems
              .filter(
                (l): l is FormSystemListItem => l !== null && l !== undefined,
              )
              .map((l) => {
                return {
                  id: l.id,
                }
              }),
          },
        },
      },
    })
  }

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
  }, [])

  useEffect(() => {
    setConnecting(listItems.map(() => false))
  }, [listItems])

  const toggleListItemSelected = (id: string, checked: boolean) => {
    const listItemToUpdate = listItems.find((l) => l?.id === id)
    if (listItemToUpdate) {
      updateListItem({
        variables: {
          input: {
            id: id,
            updateListItemDto: {
              isSelected: checked,
            },
          },
        },
      })
    }
    if (checked) {
      const otherSelected = listItems.find((l) => l?.isSelected && l?.id !== id)
      if (otherSelected) {
        updateListItem({
          variables: {
            input: {
              id: otherSelected.id,
              updateListItemDto: {
                isSelected: false,
              },
            },
          },
        })
      }
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      style={{ minHeight: '500px' }}
    >
      <div>
        <Row>
          <Column>
            <Text variant="h3">Listasmiður</Text>
          </Column>
        </Row>
        <Stack space={2}>
          <DndContext
            id="listDnd"
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={listItemIds}>
              {listItems &&
                listItems.map((l: Maybe<FormSystemListItem>, i: number) => {
                  if (l === null) {
                    return null
                  }
                  return (
                    <ListItem
                      key={l.id}
                      listItem={l}
                      index={i}
                      connecting={connecting ? connecting[i] : false}
                      setConnecting={setConnecting}
                      toggleSelected={toggleListItemSelected}
                    />
                  )
                })}
            </SortableContext>

            {typeof window === 'object' &&
              createPortal(
                <DragOverlay
                  dropAnimation={{
                    duration: 500,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                  }}
                >
                  {activeListItem && (
                    <ListItem
                      listItem={activeListItem}
                      index={0}
                      connecting={false}
                      setConnecting={setConnecting}
                      toggleSelected={toggleListItemSelected}
                    />
                  )}
                </DragOverlay>,
                document.body,
              )}
          </DndContext>
        </Stack>
      </div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flexEnd"
        marginTop={2}
      >
        {!isPublished && (
          <Box marginRight={2}>
            <Button variant="ghost" onClick={addListItem}>
              {formatMessage(m.addListItem)}
            </Button>
          </Box>
        )}
        <div>
          <Button
            onClick={() => {
              setInListBuilder(false)
              setSelectStatus(NavbarSelectStatus.OFF)
            }}
          >
            {formatMessage(m.finish)}
          </Button>
        </div>
      </Box>
    </Box>
  )
}
