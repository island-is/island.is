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
import { Fragment, useContext, useMemo } from 'react'
import AnimateHeight from 'react-animate-height'
import { createPortal } from 'react-dom'
import { useIntl } from 'react-intl'
import { ControlContext, IControlContext } from '../../context/ControlContext'
import { baseSettingsStep } from '../../lib/utils/getBaseSettingsSection'
import { ItemType } from '../../lib/utils/interfaces'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useNavbarDnD } from '../../lib/utils/useNavbarDnd'
import { NavComponent } from '../NavComponent/NavComponent'
import * as styles from './Navbar.css'
import { urlSettingsStep } from '../../lib/utils/getUrlSettingsSection'

export const Navbar = () => {
  const {
    control,
    controlDispatch,
    inSettings,
    setOpenComponents,
    openComponents,
  } = useContext(ControlContext) as IControlContext
  const { formatMessage } = useIntl()
  const { activeItem, form } = control
  const { sections, screens, fields } = form
  const payment = sections?.find((s) => s?.sectionType === SectionTypes.PAYMENT)
  const { hasPayment } = form
  const sectionIds = useMemo(
    () =>
      sections
        ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
        .map((s) => s.id as UniqueIdentifier),
    [sections],
  )
  const screenIds = useMemo(
    () =>
      screens
        ?.filter((s): s is FormSystemScreen => s !== null && s !== undefined)
        .map((s) => s.id as UniqueIdentifier),
    [screens],
  )
  const fieldsIds = useMemo(
    () =>
      fields
        ?.filter((f): f is FormSystemField => f !== null && f !== undefined)
        .map((f) => f.id as UniqueIdentifier),
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

  const { sensors, onDragStart, onDragOver, onDragEnd } = useNavbarDnD()

  const renderNonInputSections = () => {
    return sections
      ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
      .filter(
        (s) =>
          s.sectionType !== SectionTypes.INPUT &&
          s.sectionType !== SectionTypes.SUMMARY &&
          s.sectionType !== SectionTypes.PAYMENT,
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
          active={activeItem.data?.id === field.id}
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
      .map((screen) => (
        <Box key={screen.id}>
          <NavComponent
            type="Screen"
            data={screen}
            active={activeItem.data?.id === screen.id}
            focusComponent={focusComponent}
          />
          <SortableContext items={fieldsIds ?? []}>
            <AnimateHeight
              duration={300}
              height={openComponents.screens.includes(screen.id) ? 'auto' : 0}
              easing="ease-in-out"
            >
              {renderFieldsForScreen(screen)}
            </AnimateHeight>
          </SortableContext>
        </Box>
      ))
  }

  const renderInputSections = () => {
    return sections
      ?.filter(
        (s): s is FormSystemSection =>
          s !== null && s !== undefined && s.sectionType === SectionTypes.INPUT,
      )
      .map((section, index) => (
        <Box key={section.id}>
          <NavComponent
            type="Section"
            data={section}
            active={activeItem.data?.id === section.id}
            index={index + 1}
            focusComponent={focusComponent}
          />
          <SortableContext items={screenIds ?? []}>
            <AnimateHeight
              duration={300}
              height={openComponents.sections.includes(section.id) ? 'auto' : 0}
              easing="ease-in-out"
            >
              {renderScreensForSection(section)}
            </AnimateHeight>
          </SortableContext>
        </Box>
      ))
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
    </>
  )

  const renderDnDView = () => (
    <div>
      <Box className={cn(styles.navbarContainer)}>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <SortableContext items={sectionIds ?? []}>
            {renderInputSections()}
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
                  active
                  focusComponent={focusComponent}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </Box>
      {payment && hasPayment && (
        <Fragment>
          <NavComponent
            type="Section"
            data={payment}
            active={activeItem.data?.id === payment.id}
            focusComponent={focusComponent}
          />
          {renderScreensForSection(payment as FormSystemSection)}
        </Fragment>
      )}
      <Box
        display="flex"
        justifyContent="center"
        paddingTop={3}
        className={cn(styles.addSectionButton)}
      >
        <Button variant="ghost" size="small" onClick={addSection}>
          {formatMessage(m.addSection)}
        </Button>
      </Box>
    </div>
  )

  if (inSettings) {
    return renderSettingsView()
  } else if (activeItem) {
    return renderDnDView()
  }
  return null
}
