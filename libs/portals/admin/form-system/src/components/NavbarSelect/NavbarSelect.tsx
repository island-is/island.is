import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/enums'
import { Box, Button } from '@island.is/island-ui/core'
import { useContext, useMemo } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { NavbarSelectStatus } from '../../lib/utils/interfaces'
import { NavComponent as SelectNavComponent } from '../NavComponent/NavComponent'

const filterSections = (
  sections: Maybe<Maybe<FormSystemSection>[]> | undefined,
): FormSystemSection[] => {
  if (!sections) return []

  return sections
    .filter(
      (section): section is FormSystemSection =>
        section !== null &&
        section !== undefined &&
        section.sectionType === SectionTypes.INPUT,
    )
    .sort((a, b) => {
      const ao = a.displayOrder ?? Number.MAX_SAFE_INTEGER
      const bo = b.displayOrder ?? Number.MAX_SAFE_INTEGER
      return ao - bo
    })
}

export const NavbarSelect = () => {
  const { control, selectStatus, openComponents, setOpenComponents } =
    useContext(ControlContext)

  const { activeItem, form } = control
  const { sections, screens, fields } = form
  let selectable = false

  const inputSections = useMemo(() => filterSections(sections), [sections])

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

  const paymentFields = fields
    ?.filter(
      (field): field is FormSystemField =>
        !!field && field.fieldType === FieldTypesEnum.PAYMENT,
    )
    .sort((a, b) => {
      const ao = a.displayOrder ?? Number.MAX_SAFE_INTEGER
      const bo = b.displayOrder ?? Number.MAX_SAFE_INTEGER
      return ao - bo
    })

  const renderFieldsForScreen = (screen: Maybe<FormSystemScreen>) => {
    return fields
      ?.filter((field) => field?.screenId === screen?.id)
      .map((field) => {
        if (
          activeItem?.data?.id === field?.id &&
          selectStatus !== NavbarSelectStatus.ON_WITHOUT_SELECT
        ) {
          selectable = true
        }

        return (
          <SelectNavComponent
            key={field?.id}
            type="Field"
            data={field as FormSystemField}
            active={activeItem?.data?.id === field?.id}
            selectable={selectable}
            stylePaymentFieldAsSection={
              field?.fieldType === FieldTypesEnum.PAYMENT
            }
          />
        )
      })
  }

  const renderScreensForSection = (section: FormSystemSection) => {
    if (section.sectionType === SectionTypes.PARTIES) return null
    if (section.sectionType === SectionTypes.PAYMENT) return null

    return screens
      ?.filter((screen) => screen?.sectionId === section.id)
      .map((screen) => (
        <Box key={screen?.id}>
          <SelectNavComponent
            type="Screen"
            data={screen as FormSystemScreen}
            active={activeItem?.data?.id === screen?.id}
            selectable={selectable}
          />
          {openComponents.screens.includes(screen?.id as string) &&
            renderFieldsForScreen(screen)}
        </Box>
      ))
  }

  const renderPaymentFields = () => {
    return paymentFields?.map((field) => {
      if (
        activeItem?.data?.id === field.id &&
        selectStatus !== NavbarSelectStatus.ON_WITHOUT_SELECT
      ) {
        selectable = true
      }

      return (
        <SelectNavComponent
          key={field.id}
          type="Field"
          data={field}
          active={activeItem?.data?.id === field.id}
          selectable={selectable}
          stylePaymentFieldAsSection
        />
      )
    })
  }

  return (
    <>
      <Box display="flex" justifyContent="flexEnd" paddingBottom={2}>
        <Button
          variant="text"
          size="small"
          onClick={toggleAllNavbarItems}
          disabled={inputSectionIds.length === 0}
        >
          {allNavbarItemsOpen ? 'Loka öllu' : 'Opna allt'}
        </Button>
      </Box>

      <Box style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
        {inputSections.map((section) => (
          <Box key={section.id}>
            <SelectNavComponent
              type="Section"
              data={section}
              active={activeItem?.data?.id === section.id}
              selectable={selectable}
            />
            {openComponents.sections.includes(section.id) &&
              renderScreensForSection(section)}
          </Box>
        ))}
      </Box>

      {form.hasPayment ? <Box>{renderPaymentFields()}</Box> : null}
    </>
  )
}
