import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
  Button,
  Stack,
} from '@island.is/island-ui/core'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import ListItem from './components/ListItem'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { updateItem } from '../../../../services/apiService'
import { IInput, NavbarSelectStatus } from '../../../../types/interfaces'

type Props = {
  setInListBuilder: Dispatch<SetStateAction<boolean>>
}

export default function ListBuilder({ setInListBuilder }: Props) {
  const {
    lists,
    listsDispatch,
    activeListItem,
    selectStatus,
    setSelectStatus,
  } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const listItems = currentItem.inputSettings.listi
  const listItemIds = useMemo(() => listItems.map((li) => li.guid), [listItems])
  const [connecting, setConnecting] = useState<boolean[]>([false])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  useEffect(() => {
    if (listItems.length === 0) {
      listsDispatch({
        type: 'addListItem',
      })
    }
    setSelectStatus((prev) =>
      selectStatus === NavbarSelectStatus.OFF
        ? NavbarSelectStatus.ON_WITHOUT_SELECT
        : prev,
    )
    setConnecting(listItems.map(() => false))
  }, [listItems, listsDispatch, selectStatus, setSelectStatus])

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      style={{ minHeight: '500px' }}
    >
      <Box>
        <Row>
          <Column>
            <Text variant="h3">Listasmiður</Text>
          </Column>
        </Row>
        <Stack space={2}>
          <DndContext
            id={'listDnd'}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={listItemIds}>
              {listItems &&
                listItems.map((l, i) => {
                  return (
                    <ListItem
                      key={l.guid}
                      listItem={l}
                      isRadio={currentItem.type === 'Valhnappar'}
                      index={i}
                      connecting={connecting ? connecting[i] : false}
                      setConnecting={setConnecting}
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
                      isRadio={currentItem.type === 'Valhnappar'}
                      index={0}
                      connecting={false}
                      setConnecting={setConnecting}
                    />
                  )}
                </DragOverlay>,
                document.body,
              )}
          </DndContext>
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flexEnd"
        marginTop={2}
      >
        <Box marginRight={2}>
          <Button variant="ghost" onClick={addListItem}>
            + Bæta við gildi
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => {
              setInListBuilder(false)
              setSelectStatus(NavbarSelectStatus.OFF)
            }}
          >
            Ljúka
          </Button>
        </Box>
      </Box>
    </Box>
  )

  function addListItem() {
    listsDispatch({
      type: 'addListItem',
    })
    setConnecting((prev) => [...prev, false])
  }

  function onDragStart(event: DragStartEvent) {
    console.log('DRAG START', event.active.data.current.listItem)
    listsDispatch({
      type: 'setActiveListItem',
      payload: {
        listItem: event.active.data.current.listItem,
      },
    })
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) return
    console.log('Active: ', active.data.current.listItem.text.is)
    console.log('Over: ', over.data.current.listItem.text.is)
    const activeId = active.id
    const overId = over.id
    listsDispatch({
      type: 'listItemOverListItem',
      payload: {
        activeId: activeId,
        overId: overId,
      },
    })
  }

  // Update activeItem and set activeListItem to null
  function onDragEnd() {
    listsDispatch({
      type: 'setActiveListItem',
      payload: {
        listItem: null,
      },
    })
    updateItem('Input', currentItem)
  }
}
