import {
  DndContext,
  DragOverlay,
  UniqueIdentifier
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
} from '@island.is/api/schema'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { ItemType } from '../../lib/utils/interfaces'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { NavComponent } from '../NavComponent/NavComponent'
import {
  CREATE_SECTION,
  UPDATE_SECTION_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'
import { m, SectionTypes } from '@island.is/form-system/ui'
import { useNavbarDnD } from '../../lib/utils/useNavbarDnd'


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

  const [createSection, { loading }] = useMutation(CREATE_SECTION)
  const [updateDisplayOrder] = useMutation(UPDATE_SECTION_DISPLAY_ORDER)

  const addSection = async () => {
    try {
      const newSection = await createSection({
        variables: {
          input: {
            createSectionDto: {
              formId: form.id,
              displayOrder: sections?.length ?? 0,
            },
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
        const updatedSections = sections?.map((s) => {
          return {
            id: s?.id,
          }
        })
        updateDisplayOrder({
          variables: {
            input: {
              updateSectionsDisplayOrderDto: {
                sectionsDisplayOrderDto: [
                  ...(updatedSections ?? []),
                  { id: newSection.data?.formSystemCreateSection.id },
                ],
              },
            },
          },
        })
      }
    } catch (err) {
      console.error('Error creating section:', err.message)
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

  const { sensors, onDragStart, onDragOver, onDragEnd } = useNavbarDnD()

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
          .filter((s) => s.sectionType !== SectionTypes.INPUT)
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
              const section = sections?.find(
                (s) => s?.sectionType === SectionTypes.INPUT,
              )
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
              .filter((s) => s.sectionType === SectionTypes.INPUT)
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
