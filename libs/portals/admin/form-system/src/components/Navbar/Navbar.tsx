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
import { baseSettingsStep } from '../../utils/getBaseSettingsStep'
import { NavbarTab } from './components/NavbarTab/NavbarTab'
import {
  FormSystemGroup,
  FormSystemInput,
  FormSystemStep,
  Maybe,
} from '@island.is/api/schema'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { ItemType } from '../../lib/utils/interfaces'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useFormSystemCreateStepMutation } from './CreateStep.generated'
import { useIntl } from 'react-intl'
import { m } from '../../lib/messages'
import { NavComponent } from '../NavComponent/NavComponent'

type DndAction =
  | 'STEP_OVER_STEP'
  | 'GROUP_OVER_STEP'
  | 'GROUP_OVER_GROUP'
  | 'INPUT_OVER_GROUP'
  | 'INPUT_OVER_INPUT'

export const Navbar = () => {
  const { control, controlDispatch, setInSettings, inSettings, formUpdate } =
    useContext(ControlContext) as IControlContext

  const { formatMessage } = useIntl()

  const { activeItem, form } = control
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form
  const stepsIds = useMemo(
    () =>
      steps
        ?.filter((s): s is FormSystemStep => s !== null && s !== undefined)
        .map((s) => s?.guid as UniqueIdentifier),
    [steps],
  )
  const groupsIds = useMemo(
    () =>
      groups
        ?.filter((g): g is FormSystemGroup => g !== null && g !== undefined)
        .map((g) => g?.guid as UniqueIdentifier),
    [groups],
  )
  const inputsIds = useMemo(
    () =>
      inputs
        ?.filter((i): i is FormSystemInput => i !== null && i !== undefined)
        .map((i) => i?.guid as UniqueIdentifier),
    [inputs],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )
  const [createStep] = useFormSystemCreateStepMutation()

  const addStep = async () => {
    const newStep = await createStep({
      variables: {
        input: {
          stepCreationDto: {
            formId: form?.id as number,
            displayOrder: steps?.length,
          },
        },
      },
    })
    if (newStep) {
      controlDispatch({
        type: 'ADD_STEP',
        payload: {
          step: removeTypename(
            newStep.data?.formSystemCreateStep,
          ) as FormSystemStep,
        },
      })
    }
  }

  const focusComponent = (type: ItemType, id: UniqueIdentifier) => {
    const data =
      type === 'Step'
        ? steps?.find(
            (item: Maybe<FormSystemStep> | undefined) => item?.guid === id,
          )
        : type === 'Group'
        ? groups?.find(
            (item: Maybe<FormSystemGroup> | undefined) => item?.guid === id,
          )
        : inputs?.find(
            (item: Maybe<FormSystemInput> | undefined) => item?.guid === id,
          )
    if (id === baseSettingsStep.guid) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Step',
            data: baseSettingsStep,
          },
        },
      })
    } else if (data) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: type,
            data: data,
          },
        },
      })
    }
  }

  const onDragStart = (event: DragStartEvent) => {
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

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return
    const activeStep = active.data?.current?.type === 'Step'
    const activeGroup = active.data?.current?.type === 'Group'
    const activeInput = active.data?.current?.type === 'Input'
    const overStep = over.data?.current?.type === 'Step'
    const overGroup = over.data?.current?.type === 'Group'
    const overInput = over.data?.current?.type === 'Input'

    const dispatchDragAction = (type: DndAction) =>
      controlDispatch({ type, payload: { activeId: activeId, overId: overId } })

    //Dragging step
    if (activeStep && overStep) {
      dispatchDragAction('STEP_OVER_STEP')
    }

    // // Dragging Group
    if (activeGroup) {
      if (overStep) {
        dispatchDragAction('GROUP_OVER_STEP')
      }
      if (overGroup) {
        dispatchDragAction('GROUP_OVER_GROUP')
      }
    }

    // // Dragging Input
    if (activeInput) {
      if (overGroup) {
        dispatchDragAction('INPUT_OVER_GROUP')
      }
      if (overInput) {
        dispatchDragAction('INPUT_OVER_INPUT')
      }
    }
  }

  const onDragEnd = () => {
    formUpdate()
  }

  if (inSettings) {
    return (
      <div>
        <Box paddingBottom={2} overflow="hidden" flexDirection="row">
          <NavbarTab />
        </Box>
        <div>
          <NavComponent
            type="Step"
            data={baseSettingsStep}
            active={activeItem.data?.guid === baseSettingsStep.guid}
            focusComponent={focusComponent}
          />
        </div>
        {steps
          ?.filter((s): s is FormSystemStep => s !== null && s !== undefined)
          .filter((s) => s.type !== 'Input')
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
              const step = steps?.find((s) => s?.type === 'Input')
              if (step) {
                controlDispatch({
                  type: 'SET_ACTIVE_ITEM',
                  payload: {
                    activeItem: {
                      type: 'Step',
                      data: step,
                    },
                  },
                })
              }
            }}
          >
            {formatMessage(m.saveAndContinue)}
          </Button>
        </Box>
      </div>
    )
  } else if (activeItem) {
    return (
      <div>
        <Box
          paddingBottom={2}
          overflow="hidden"
          display="flex"
          flexDirection="row"
        >
          <NavbarTab />
        </Box>
        <DndContext
          id="navDnd"
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={stepsIds ?? []}>
            {steps
              ?.filter(
                (s): s is FormSystemStep => s !== null && s !== undefined,
              )
              .filter((s) => s.type === 'Input')
              .map((s, i) => (
                <Box key={s.guid}>
                  <NavComponent
                    type="Step"
                    data={s}
                    active={activeItem.data?.guid === s.guid}
                    index={i + 1}
                    focusComponent={focusComponent}
                  />
                  <SortableContext items={groupsIds ?? []}>
                    {groups
                      ?.filter(
                        (g): g is FormSystemGroup =>
                          g !== null && g !== undefined,
                      )
                      .filter((g) => g.stepGuid === s.guid)
                      .map((g) => (
                        <Box key={g.guid}>
                          <NavComponent
                            type="Group"
                            data={g}
                            active={activeItem.data?.guid === g.guid}
                            focusComponent={focusComponent}
                          />

                          <SortableContext items={inputsIds ?? []}>
                            {inputs
                              ?.filter(
                                (i): i is FormSystemInput =>
                                  i !== null && i !== undefined,
                              )
                              .filter((i) => i.groupGuid === g.guid)
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

          {createPortal(
            <DragOverlay
              dropAnimation={{
                duration: 500,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
              }}
            >
              {activeItem && (
                <NavComponent
                  type={activeItem.type}
                  data={
                    activeItem.data as
                      | FormSystemGroup
                      | FormSystemStep
                      | FormSystemInput
                  }
                  active={activeItem.data?.guid === activeItem.data?.guid}
                  focusComponent={focusComponent}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
        <Box display="flex" justifyContent="center" paddingTop={3}>
          <Button variant="ghost" size="small" onClick={addStep}>
            {formatMessage(m.addStep)}
          </Button>
        </Box>
      </div>
    )
  }
  return null
}
