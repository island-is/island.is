import {
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  DragOverlay,
  UniqueIdentifier,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useContext, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Box, Button } from '@island.is/island-ui/core'
import FormBuilderContext from '../../context/FormBuilderContext'
import { baseSettingsStep } from '../../utils/getBaseSettingsStep'
import { IFormBuilderContext, ItemType } from '../../types/interfaces'
import {
  addStep,
} from '../../services/apiService'
import NavbarTab from './components/NavbarTab/NavbarTab'
import NavComponent from './components/NavComponent/NavComponent'

export default function Navbar() {
  const {
    formBuilder,
    lists,
    listsDispatch,
    formUpdate,
    inSettings,
    setInSettings,
  } = useContext<IFormBuilderContext>(FormBuilderContext)

  const { activeItem, steps, groups, inputs } = lists
  const stepsIds = useMemo(() => steps?.map((s) => s.guid), [steps])
  const groupsIds = useMemo(() => groups?.map((g) => g.guid), [groups])
  const inputsIds = useMemo(() => inputs?.map((i) => i.guid), [inputs])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )
  if (inSettings) {
    return (
      <Box>
        <Box paddingBottom={2} overflow="hidden" flexDirection={'row'}>
          <NavbarTab inSettings={inSettings} setInSettings={setInSettings} />
        </Box>
        <Box>
          <NavComponent
            type="Step"
            data={baseSettingsStep}
            active={activeItem.data?.guid === baseSettingsStep.guid}
            focusComponent={focusComponent}
          />
        </Box>
        {steps
          ?.filter((s) => s.type !== 'Innsláttur')
          .map((s) => (
            <Box key={s.guid}>
              <NavComponent
                type="Step"
                data={s}
                active={activeItem.data?.guid === s.guid}
                focusComponent={focusComponent}
              />
            </Box>
          ))}
        <Box display="flex" justifyContent="center" paddingTop={3}>
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setInSettings(false)
              listsDispatch({
                type: 'setActiveItem',
                payload: {
                  type: 'Step',
                  item: lists.steps.find((s) => s.type === 'Innsláttur'),
                },
              })
            }}
          >
            Vista og halda áfram
          </Button>
        </Box>
      </Box>
    )
  } else if (formBuilder && activeItem) {
    return (
      <Box>
        <Box
          paddingBottom={2}
          overflow="hidden"
          display="flex"
          flexDirection={'row'}
        >
          <NavbarTab inSettings={inSettings} setInSettings={setInSettings} />
        </Box>
        <DndContext
          id={'navDnd'}
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={stepsIds}>
            {steps
              ?.filter((s) => s.type === 'Innsláttur')
              .map((s, i) => (
                <Box key={s.guid}>
                  <NavComponent
                    type="Step"
                    data={s}
                    active={activeItem.data?.guid === s.guid}
                    index={i + 1}
                    focusComponent={focusComponent}
                  />
                  <SortableContext items={groupsIds}>
                    {groups
                      ?.filter((g) => g.stepGuid === s.guid)
                      .map((g) => (
                        <Box key={g.guid}>
                          <NavComponent
                            type="Group"
                            data={g}
                            active={activeItem.data?.guid === g.guid}
                            focusComponent={focusComponent}
                          />

                          <SortableContext items={inputsIds}>
                            {inputs
                              ?.filter((i) => i.groupGuid === g.guid)
                              .map((i) => (
                                <NavComponent
                                  key={i.guid}
                                  type="Input"
                                  data={i}
                                  active={activeItem.data?.guid === i.guid}
                                  focusComponent={focusComponent}
                                />
                              ))}
                          </SortableContext>
                        </Box>
                      ))}
                  </SortableContext>
                </Box>
              ))}
          </SortableContext>

          {/* Only render client side */}
          {typeof window === 'object' &&
            createPortal(
              <DragOverlay
                dropAnimation={{
                  duration: 500,
                  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}
              >
                {activeItem && (
                  <NavComponent
                    type={activeItem.type}
                    data={activeItem.data}
                    active={activeItem.data?.guid === activeItem.data?.guid}
                    focusComponent={focusComponent}
                  />
                )}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
        <Box display="flex" justifyContent="center" paddingTop={3}>
          <Button variant="ghost" size="small" onClick={addNewStep}>
            + Bæta við skrefi
          </Button>
        </Box>
      </Box>
    )
  }
  return null

  async function addNewStep() {
    try {
      const data = await addStep(
        formBuilder.form.id,
        { is: '', en: '' },
        lists.steps.length,
        2,
        { is: '', en: '' },
        false,
      )

      if (data !== undefined) {
        listsDispatch({ type: 'addStep', payload: { data: data } })
      }
    } catch (error) {
      console.error('Error adding new step:', error)
      // Handle error as needed
    }
  }

  function focusComponent(type: ItemType, id: UniqueIdentifier) {
    const dataTypes = {
      Step: lists.steps,
      Group: lists.groups,
      Input: lists.inputs,
    }

    const data = dataTypes[type]?.find((item) => item.guid === id)
    console.log('focusComponent data: ', data)
    listsDispatch({
      type: 'setActiveItem',
      payload: {
        type: id === baseSettingsStep.guid ? 'Step' : type,
        data: id === baseSettingsStep.guid ? baseSettingsStep : data,
      }
    })
  }

  function onDragStart(event: DragStartEvent) {
    listsDispatch({
      type: 'setActiveItem',
      payload: {
        type: event.active.data.current?.type,
        data: event.active.data.current?.data ?? null,
      },
    })
  }

  function onDragEnd() {
    formUpdate()
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const getType = (data, targetType) => data?.current?.type === targetType

    const activeStep = getType(active.data, 'Step')
    const activeGroup = getType(active.data, 'Group')
    const activeInput = getType(active.data, 'Input')
    const overStep = getType(over.data, 'Step')
    const overGroup = getType(over.data, 'Group')
    const overInput = getType(over.data, 'Input')

    const dispatchDragAction = (type: string) =>
      listsDispatch({ type, payload: { activeId, overId } })

    // Dragging step
    if (activeStep && overStep) {
      dispatchDragAction('stepOverStep')
    }

    // Dragging Group
    if (activeGroup) {
      if (overStep) {
        dispatchDragAction('groupOverStep')
      }
      if (overGroup) {
        dispatchDragAction('groupOverGroup')
      }
    }

    // Dragging Input
    if (activeInput) {
      if (overGroup) {
        dispatchDragAction('inputOverGroup')
      }
      if (overInput) {
        dispatchDragAction('inputOverInput')
      }
    }
  }
}
