import { useMutation } from '@apollo/client'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import {
  FormSystemField,
  FormSystemListItem,
  Maybe,
} from '@island.is/api/schema'
import { TemplateListTypesEnum } from '@island.is/form-system/enums'
import {
  CREATE_LIST_ITEM,
  GET_TEMPLATE_LIST,
  UPDATE_LIST_ITEM,
  UPDATE_LIST_ITEM_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Divider,
  Icon,
  ModalBase,
  Select,
  Stack,
  Text,
  type Option,
} from '@island.is/island-ui/core'
import { useContext, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../../../../lib/utils/interfaces'
import { removeTypename } from '../../../../../../lib/utils/removeTypename'
import { ListItem } from './components/ListItem'

export const ListBuilder = () => {
  const [createListItem] = useMutation(CREATE_LIST_ITEM)
  const [applyTemplateList, { loading: applyTemplateListLoading }] =
    useMutation(GET_TEMPLATE_LIST)
  const [updateListItemDisplayOrder] = useMutation(
    UPDATE_LIST_ITEM_DISPLAY_ORDER,
  )
  const [updateListItem] = useMutation(UPDATE_LIST_ITEM)
  const { control, controlDispatch, setSelectStatus, setInListBuilder } =
    useContext(ControlContext)
  const { isReadOnly } = control
  const currentItem = control.activeItem.data as FormSystemField
  const { activeListItem } = control

  const EMPTY_LIST: FormSystemListItem[] = []

  const listItems = currentItem?.list ?? EMPTY_LIST

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
  const [selectedTemplateList, setSelectedTemplateList] =
    useState<Option<string> | null>(null)
  const [pendingTemplateList, setPendingTemplateList] =
    useState<Option<string> | null>(null)

  const { formatMessage } = useIntl()

  const templateLists: Option<string>[] = [
    { label: 'Já/Nei', value: TemplateListTypesEnum.YES_NO },
    { label: 'Samþykkja/Hafna', value: TemplateListTypesEnum.ACCEPT_DECLINE },
  ]

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

  const hasExistingListItems = listItems.some(
    (l) => l !== null && l !== undefined,
  )

  const applyTemplate = async (selected: Option<string>) => {
    const templateListType = selected.value

    if (!templateListType || !currentItem.id) {
      return
    }

    try {
      const templateList = await applyTemplateList({
        variables: {
          input: {
            fieldId: currentItem.id,
            templateListType,
          },
        },
      })

      controlDispatch({
        type: 'SET_LIST_ITEMS',
        payload: {
          listItems: removeTypename(
            templateList.data.applyFormSystemTemplateList,
          ),
        },
      })
    } catch (e) {
      console.error('Error applying template list:', e.message)
    } finally {
      setSelectedTemplateList(null)
    }
  }

  const selectTemplateList = (selected?: Option<string> | null) => {
    if (!selected?.value || !currentItem.id) {
      return
    }
    setSelectedTemplateList(selected)

    if (hasExistingListItems) {
      setPendingTemplateList(selected)
      return
    }

    applyTemplate(selected)
  }

  const confirmApplyTemplate = () => {
    if (pendingTemplateList) {
      applyTemplate(pendingTemplateList)
    }
    setPendingTemplateList(null)
  }

  const cancelApplyTemplate = () => {
    setPendingTemplateList(null)
    setSelectedTemplateList(null)
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
    setConnecting(Array(listItems.length).fill(false))
  }, [currentItem.id, listItems.length])

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
      style={{ minHeight: 'clamp(400px, 70vh, 900px)', flexGrow: 1 }}
    >
      <Box display="flex" flexDirection="column" style={{ flexGrow: 1 }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="spaceBetween"
          alignItems="flexEnd"
          marginBottom={2}
        >
          <Box>
            <Text variant="h3">{formatMessage(m.listBuilder)}</Text>
            {/* <Text variant="small" color="dark400">
              {formatMessage(m.listBuilderSubtitle)}
            </Text> */}
          </Box>
          {!isReadOnly && (
            <Box style={{ width: 300, flexShrink: 0 }}>
              <Select
                name="templateLists"
                label={formatMessage(m.predeterminedLists)}
                placeholder={formatMessage(m.chooseListType)}
                options={templateLists}
                value={selectedTemplateList}
                isDisabled={applyTemplateListLoading}
                backgroundColor="white"
                size="sm"
                onChange={selectTemplateList}
              />
            </Box>
          )}
        </Box>
        <Divider />
        <ModalBase
          baseId="applyTemplateListConfirm"
          isVisible={pendingTemplateList !== null}
          onVisibilityChange={(visible) => {
            if (!visible) {
              cancelApplyTemplate()
            }
          }}
          modalLabel={formatMessage(m.areYouSure)}
          removeOnClose
        >
          {({ closeModal }: { closeModal: () => void }) => (
            <Box
              background="white"
              borderRadius="large"
              padding={[3, 6]}
              style={{
                maxWidth: 480,
                margin: '80px auto',
                boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
              }}
            >
              <Text variant="h3" marginBottom={2}>
                {formatMessage(m.areYouSure)}
              </Text>
              <Text marginBottom={4}>
                {formatMessage(m.overwriteListConfirm)}
              </Text>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Button variant="ghost" onClick={closeModal}>
                  {formatMessage(m.cancel)}
                </Button>
                <Button
                  onClick={() => {
                    confirmApplyTemplate()
                    closeModal()
                  }}
                >
                  {formatMessage(m.confirm)}
                </Button>
              </Box>
            </Box>
          )}
        </ModalBase>
        {hasExistingListItems ? (
          <Box marginTop={3}>
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
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            style={{ flexGrow: 1, minHeight: 240 }}
          >
            <Box
              background="blue100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{ width: 64, height: 64 }}
              marginBottom={2}
            >
              <Icon icon="list" color="blue400" size="large" type="outline" />
            </Box>
            <Text variant="h4">{formatMessage(m.noListSelected)}</Text>
            <Text variant="small" color="dark400">
              {formatMessage(m.noListSelectedDescription)}
            </Text>
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flexEnd"
        marginTop={2}
      >
        {!isReadOnly && (
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
