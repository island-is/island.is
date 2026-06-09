import { useMutation } from '@apollo/client'
import { DndContext, DragOverlay, UniqueIdentifier } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import {
  CREATE_SECTION,
  UPDATE_SECTION_DISPLAY_ORDER,
} from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { Box, Button } from '@island.is/island-ui/core'
import cn from 'classnames'
import { useContext, useMemo } from 'react'
import AnimateHeight from 'react-animate-height'
import { createPortal } from 'react-dom'
import { useIntl } from 'react-intl'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import {
  lifetimeSettingsStep,
  urlSettingsStep,
} from '../../lib/utils/customSections'
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'
import { ItemType } from '../../lib/utils/interfaces'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useNavbarDnD } from '../../lib/utils/useNavbarDnd'
import { NavComponent } from '../NavComponent/NavComponent'
import * as styles from './Navbar.css'

export const Navbar = () => {
  const {
    control,
    controlDispatch,
    inSettings,
    openComponents,
    setOpenComponents,
  } = useContext(ControlContext) as IControlContext

  const { formatMessage } = useIntl()
  const { activeItem, form, isReadOnly } = control
  const { sections, screens, fields } = form

  const inputSections = useMemo(
    () =>
      sections?.filter(
        (section): section is FormSystemSection =>
          section !== null &&
          section !== undefined &&
          section.sectionType === SectionTypes.INPUT,
      ) ?? [],
    [sections],
  )

  const inputScreens = useMemo(
    () =>
      screens?.filter(
        (screen): screen is FormSystemScreen =>
          screen !== null &&
          screen !== undefined &&
          inputSections.some((section) => section.id === screen.sectionId),
      ) ?? [],
    [screens, inputSections],
  )

  const inputSectionIds = useMemo(
    () =>
      inputSections
        .map((section) => section.id)
        .filter((id): id is string => Boolean(id)),
    [inputSections],
  )

  const inputScreenIds = useMemo(
    () =>
      inputScreens
        .map((screen) => screen.id)
        .filter((id): id is string => Boolean(id)),
    [inputScreens],
  )

  const allNavbarItemsOpen =
    inputSectionIds.length > 0 &&
    inputSectionIds.every((id) => openComponents.sections.includes(id)) &&
    inputScreenIds.every((id) => openComponents.screens.includes(id))

  const toggleAllNavbarItems = () => {
    setOpenComponents(
      allNavbarItemsOpen
        ? {
            sections: [],
            screens: [],
          }
        : {
            sections: inputSectionIds,
            screens: inputScreenIds,
          },
    )
  }

  const sectionIds = useMemo(
    () =>
      sections
        ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
        .map((s) => s.id as UniqueIdentifier),
    [sections],
  )

  const screenIdsBySection = useMemo(() => {
    const map = new Map<string, UniqueIdentifier[]>()

    screens
      ?.filter((screen): screen is FormSystemScreen =>
        Boolean(screen?.id && screen?.sectionId),
      )
      .forEach((screen) => {
        const existing = map.get(screen.sectionId as string) ?? []

        map.set(screen.sectionId as string, [
          ...existing,
          screen.id as UniqueIdentifier,
        ])
      })

    return map
  }, [screens])

  const fieldIdsByScreen = useMemo(() => {
    const map = new Map<string, UniqueIdentifier[]>()

    fields
      ?.filter((field): field is FormSystemField =>
        Boolean(field?.id && field?.screenId),
      )
      .forEach((field) => {
        const existing = map.get(field.screenId as string) ?? []

        map.set(field.screenId as string, [
          ...existing,
          field.id as UniqueIdentifier,
        ])
      })

    return map
  }, [fields])

  const [createSection, { loading }] = useMutation(CREATE_SECTION)
  const [updateDisplayOrder] = useMutation(UPDATE_SECTION_DISPLAY_ORDER)

  const {
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    isDraggingNavbarItem,
    activeDragType,
    pendingDropId,
  } = useNavbarDnD()

  const isPendingDropTarget = (id?: string | null) => {
    return Boolean(
      isDraggingNavbarItem &&
        activeDragType &&
        pendingDropId &&
        id &&
        pendingDropId === id &&
        activeItem.data?.id !== id,
    )
  }

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
              newSection.data?.createFormSystemSection,
            ) as FormSystemSection,
          },
        })

        const updatedSections = sections?.map((s) => ({
          id: s?.id,
        }))

        updateDisplayOrder({
          variables: {
            input: {
              updateSectionsDisplayOrderDto: {
                sectionsDisplayOrderDto: [
                  ...(updatedSections ?? []),
                  { id: newSection.data?.createFormSystemSection.id },
                ],
              },
            },
          },
        })
      }
    } catch (err: any) {
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
    } else if (id === urlSettingsStep.id) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Section',
            data: urlSettingsStep,
          },
        },
      })
    } else if (id === lifetimeSettingsStep.id) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type: 'Section',
            data: lifetimeSettingsStep,
          },
        },
      })
    } else if (data) {
      controlDispatch({
        type: 'SET_ACTIVE_ITEM',
        payload: {
          activeItem: {
            type,
            data,
          },
        },
      })
    }
  }

  const renderToggleAllButton = () => (
    <Box display="flex" justifyContent="flexEnd" paddingBottom={2}>
      <Button
        icon={allNavbarItemsOpen ? 'chevronUp' : 'chevronDown'}
        iconType="filled"
        circle
        inline
        variant="ghost"
        size="small"
        onClick={toggleAllNavbarItems}
        disabled={inputSectionIds.length === 0}
        title={allNavbarItemsOpen ? 'Loka öllu' : 'Opna allt'}
        aria-label={allNavbarItemsOpen ? 'Loka öllu' : 'Opna allt'}
      />
    </Box>
  )

  const renderNonInputSections = () => {
    return sections
      ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
      .filter(
        (s) =>
          s.sectionType !== SectionTypes.INPUT &&
          s.sectionType !== SectionTypes.SUMMARY,
      )
      .map((s) => (
        <Box key={s.id}>
          <NavComponent
            type="Section"
            data={s}
            active={activeItem.data?.id === s.id}
            focusComponent={focusComponent}
          />
        </Box>
      ))
  }

  const renderFieldsForScreen = (screen: FormSystemScreen) => {
    return fields
      ?.filter(
        (field): field is FormSystemField =>
          field !== null && field !== undefined && field.screenId === screen.id,
      )
      .map((field) => (
        <NavComponent
          key={field.id}
          type="Field"
          data={field}
          active={
            activeItem.data?.id === field.id || isPendingDropTarget(field.id)
          }
          focusComponent={focusComponent}
        />
      ))
  }

  const renderScreensForSection = (section: FormSystemSection) => {
    return screens
      ?.filter(
        (screen): screen is FormSystemScreen =>
          screen !== null &&
          screen !== undefined &&
          screen.sectionId === section.id,
      )
      .map((screen) => {
        const screenIsOpen = openComponents.screens.includes(screen.id)

        return (
          <Box key={screen.id}>
            <NavComponent
              type="Screen"
              data={screen}
              active={
                activeItem.data?.id === screen.id ||
                isPendingDropTarget(screen.id)
              }
              focusComponent={focusComponent}
            />

            <SortableContext items={fieldIdsByScreen.get(screen.id) ?? []}>
              <AnimateHeight
                duration={isDraggingNavbarItem ? 0 : 150}
                height={screenIsOpen ? 'auto' : 0}
                easing="ease-in-out"
              >
                {renderFieldsForScreen(screen)}
              </AnimateHeight>
            </SortableContext>
          </Box>
        )
      })
  }

  const renderInputSections = () => {
    return inputSections.map((section, index) => {
      const sectionIsOpen = openComponents.sections.includes(section.id)

      return (
        <Box key={section.id}>
          <NavComponent
            type="Section"
            data={section}
            active={
              activeItem.data?.id === section.id ||
              isPendingDropTarget(section.id)
            }
            index={index + 1}
            focusComponent={focusComponent}
          />

          <SortableContext items={screenIdsBySection.get(section.id) ?? []}>
            <AnimateHeight
              duration={isDraggingNavbarItem ? 0 : 150}
              height={sectionIsOpen ? 'auto' : 0}
              easing="ease-in-out"
            >
              {renderScreensForSection(section)}
            </AnimateHeight>
          </SortableContext>
        </Box>
      )
    })
  }

  const renderSettingsView = () => (
    <>
      <div>
        <NavComponent
          type="Section"
          data={baseSettingsStep}
          active={activeItem.data?.id === baseSettingsStep.id}
          focusComponent={focusComponent}
        />
      </div>

      {renderNonInputSections()}

      <div>
        <NavComponent
          type="Section"
          data={urlSettingsStep}
          active={activeItem.data?.id === urlSettingsStep.id}
          focusComponent={focusComponent}
        />
      </div>

      <div>
        <NavComponent
          type="Section"
          data={lifetimeSettingsStep}
          active={activeItem.data?.id === lifetimeSettingsStep.id}
          focusComponent={focusComponent}
        />
      </div>
    </>
  )

  const renderDnDView = () => (
    <div>
      {renderToggleAllButton()}

      <Box className={cn(styles.navbarContainer)}>
        <DndContext
          sensors={isReadOnly ? [] : sensors}
          onDragStart={isReadOnly ? undefined : onDragStart}
          onDragEnd={isReadOnly ? undefined : onDragEnd}
          onDragCancel={isReadOnly ? undefined : onDragCancel}
          onDragOver={isReadOnly ? undefined : onDragOver}
        >
          <SortableContext items={sectionIds ?? []}>
            {renderInputSections()}
          </SortableContext>

          {createPortal(
            <DragOverlay dropAnimation={null}>
              {activeItem && (
                <NavComponent
                  type={activeItem.type}
                  data={
                    activeItem.data as
                      | FormSystemScreen
                      | FormSystemSection
                      | FormSystemField
                  }
                  active
                  focusComponent={focusComponent}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        paddingTop={3}
        className={cn(styles.addSectionButton)}
      >
        <Button
          variant="ghost"
          size="small"
          onClick={addSection}
          disabled={isReadOnly}
        >
          {formatMessage(m.addSection)}
        </Button>
      </Box>
    </div>
  )

  if (inSettings) {
    return renderSettingsView()
  }

  if (activeItem) {
    return renderDnDView()
  }

  return null
}
