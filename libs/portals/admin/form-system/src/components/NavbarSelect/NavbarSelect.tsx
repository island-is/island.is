import {
  FormSystemField,
  FormSystemScreen,
  FormSystemSection,
  Maybe,
} from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { Box } from '@island.is/island-ui/core'
import { useContext } from 'react'
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
        (section.sectionType === SectionTypes.INPUT ||
          section.sectionType === SectionTypes.PARTIES),
    )
    .sort((a, b) => {
      const ao = a.displayOrder ?? Number.MAX_SAFE_INTEGER
      const bo = b.displayOrder ?? Number.MAX_SAFE_INTEGER
      return ao - bo
    })
}

export const NavbarSelect = () => {
  const { control, selectStatus } = useContext(ControlContext)
  const { activeItem, form } = control
  const { sections, screens, fields } = form
  let selectable = false

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
          />
        )
      })
  }

  const renderScreensForSection = (section: FormSystemSection) => {
    if (section.sectionType === SectionTypes.PARTIES) return null
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
          {renderFieldsForScreen(screen)}
        </Box>
      ))
  }

  const renderSections = () => {
    return filterSections(sections).map((section) => (
      <Box key={section.id}>
        <SelectNavComponent
          type="Section"
          data={section}
          active={activeItem?.data?.id === section.id}
          selectable={selectable}
        />
        {renderScreensForSection(section)}
      </Box>
    ))
  }

  return <>{renderSections()}</>
}
