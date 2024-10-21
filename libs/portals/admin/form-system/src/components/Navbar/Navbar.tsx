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
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'
import { NavbarTab } from './components/NavbarTab/NavbarTab'
import {
  FormSystemScreen,
  FormSystemField,
  FormSystemSection,
  Maybe,
  FormSystemSectionDtoSectionTypeEnum,
} from '@island.is/api/schema'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { ItemType } from '../../lib/utils/interfaces'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { m } from '../../lib/messages'
import { NavComponent } from '../NavComponent/NavComponent'
import { CREATE_SECTION, UPDATE_SECTION_DISPLAY_ORDER } from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

type DndAction =
  | 'SECTION_OVER_SECTION'
  | 'SCREEN_OVER_SECTION'
  | 'SCREEN_OVER_SCREEN'
  | 'FIELD_OVER_SCREEN'
  | 'FIELD_OVER_FIELD'

export const Navbar = () => {
  const { control, controlDispatch, setInSettings, inSettings, updateDnD } =
    useContext(ControlContext) as IControlContext

  const { formatMessage } = useIntl()

  const { activeItem, form } = control
  const { sections, screens, fields } = form
  const sectionIds = useMemo(
    () =>
      sections
        ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
        .map((s) => s?.id as UniqueIdentifier),
    [sections],
  )
  const screenIds = useMemo(
    () =>
      screens
        ?.filter((s): s is FormSystemScreen => s !== null && s !== undefined)
        .map((s) => s?.id as UniqueIdentifier),
    [screens],
  )
  const fieldsIds = useMemo(
    () =>
      fields
        ?.filter((f): f is FormSystemField => f !== null && f !== undefined)
        .map((f) => f?.id as UniqueIdentifier),
    [fields],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )
  const [createSection, { loading }] = useMutation(CREATE_SECTION)
  const [updateDisplayOrder, { loading: updateDO }] = useMutation(UPDATE_SECTION_DISPLAY_ORDER)

  const addSection = async () => {
    const newSection = await createSection({
      variables: {
        input: {
          createSectionDto: {
            formId: form.id,
          }
        },
      },
    })
    if (newSection && !loading) {
      controlDispatch({
        type: 'ADD_SECTION',
        payload: {
          section: removeTypename(
            newSection.data?.formSystemCreateSection,
          ) as FormSystemSection,
        },
      })
      const updatedSections = sections?.map(s => {
        return {
          id: s?.id
        }
      })
      console.log('updatedSections', updatedSections)
      updateDisplayOrder({
        variables: {
          input: {
            sectionsDisplayOrderDto: sections?.map((s) => { s?.id })
          }
        }
      })
    }
  }

  const focusComponent = (type: ItemType, id: UniqueIdentifier) => {
    const data =
      type === 'Section'
        ? sections?.find(
          (item: Maybe<FormSystemSection> | undefined) => item?.id === id,
        )
        : type === 'Screen'
          ? screens?.find(
            (item: Maybe<FormSystemScreen> | undefined) => item?.id === id,
          )
          : fields?.find(
            (item: Maybe<FormSystemField> | undefined) => item?.id === id,
          )
    if (id === baseSettingsStep.id) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Section',
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
    const activeSection = active.data?.current?.type === 'Section'
    const activeScreen = active.data?.current?.type === 'Screen'
    const activeField = active.data?.current?.type === 'Field'
    const overSection = over.data?.current?.type === 'Section'
    const overScreen = over.data?.current?.type === 'Screen'
    const overField = over.data?.current?.type === 'Field'

    const dispatchDragAction = (type: DndAction) =>
      controlDispatch({ type, payload: { activeId: activeId, overId: overId } })

    //Dragging section
    if (activeSection && overSection) {
      dispatchDragAction('SECTION_OVER_SECTION')
    }

    // // Dragging screen
    if (activeScreen) {
      if (overSection) {
        dispatchDragAction('SCREEN_OVER_SECTION')
      }
      if (overScreen) {
        dispatchDragAction('SCREEN_OVER_SCREEN')
      }
    }

    // // Dragging field
    if (activeField) {
      if (overScreen) {
        dispatchDragAction('FIELD_OVER_SCREEN')
      }
      if (overField) {
        dispatchDragAction('FIELD_OVER_FIELD')
      }
    }
  }

  const onDragEnd = () => {
    updateDnD(activeItem.type)
  }

  if (inSettings) {
    return (
      <div>
        <Box paddingBottom={2} overflow="hidden" flexDirection="row">
          <NavbarTab />
        </Box>
        <div>
          <NavComponent
            type="Section"
            data={baseSettingsStep}
            active={activeItem.data?.id === baseSettingsStep.id}
            focusComponent={focusComponent}
          />
        </div>
        {sections
          ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
          .filter((s) => s.sectionType !== FormSystemSectionDtoSectionTypeEnum.Input)
          .map((s) => (
            <Box key={s.id}>
              <NavComponent
                type="Section"
                data={s}
                active={activeItem.data?.id === s.id}
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
              const section = sections?.find((s) => s?.sectionType === FormSystemSectionDtoSectionTypeEnum.Input)
              if (section) {
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
          <SortableContext items={sectionIds ?? []}>
            {sections
              ?.filter(
                (s): s is FormSystemSection => s !== null && s !== undefined,
              )
              .filter((s) => s.sectionType === FormSystemSectionDtoSectionTypeEnum.Input)
              .map((s, i) => (
                <Box key={s.id}>
                  <NavComponent
                    type="Section"
                    data={s}
                    active={activeItem.data?.id === s.id}
                    index={i + 1}
                    focusComponent={focusComponent}
                  />
                  <SortableContext items={screenIds ?? []}>
                    {screens
                      ?.filter(
                        (g): g is FormSystemScreen =>
                          g !== null && g !== undefined,
                      )
                      .filter((g) => g.sectionId === s.id)
                      .map((g) => (
                        <Box key={g.id}>
                          <NavComponent
                            type="Screen"
                            data={g}
                            active={activeItem.data?.id === g.id}
                            focusComponent={focusComponent}
                          />

                          <SortableContext items={fieldsIds ?? []}>
                            {fields
                              ?.filter(
                                (i): i is FormSystemField =>
                                  i !== null && i !== undefined,
                              )
                              .filter((i) => i.screenId === g.id)
                              .map((i) => (
                                <NavComponent
                                  key={i.id}
                                  type="Field"
                                  data={i}
                                  active={activeItem.data?.id === i.id}
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
                    | FormSystemScreen
                    | FormSystemSection
                    | FormSystemField
                  }
                  active={activeItem.data?.id === activeItem.data?.id}
                  focusComponent={focusComponent}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
        <Box display="flex" justifyContent="center" paddingTop={3}>
          <Button variant="ghost" size="small" onClick={addSection}>
            {formatMessage(m.addStep)}
          </Button>
        </Box>
      </div>
    )
  }
  return null
}
