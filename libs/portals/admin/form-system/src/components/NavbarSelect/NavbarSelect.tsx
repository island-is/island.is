import { useContext } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { NavComponent as SelectNavComponent } from '../NavComponent/NavComponent'
import { ControlContext } from '../../context/ControlContext'
import {
  FormSystemSection,
  FormSystemScreen,
  FormSystemField,
} from '@island.is/api/schema'
import { NavbarSelectStatus } from '../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import { m, SectionTypes } from '@island.is/form-system/ui'

export const NavbarSelect = () => {
  const { control, selectStatus } = useContext(ControlContext)
  const { activeItem, form } = control
  const { sections, screens, fields } = form
  let selectable = false
  const { formatMessage } = useIntl()
  return (
    <div>
      <Box paddingBottom={2} overflow="hidden">
        <Text variant="h5">{formatMessage(m.form)}</Text>
      </Box>
      {sections
        ?.filter((s): s is FormSystemSection => s !== null && s !== undefined)
        .filter((s) => s.sectionType === SectionTypes.INPUT)
        .map((s) => (
          <Box key={s.id}>
            <SelectNavComponent
              type="Section"
              data={s as FormSystemSection}
              active={activeItem?.data?.id === s.id}
              selectable={selectable}
            />
            {screens
              ?.filter((g) => g?.sectionId === s.id)
              .map((g) => (
                <Box key={g?.id}>
                  <SelectNavComponent
                    type="Screen"
                    data={g as FormSystemScreen}
                    active={activeItem?.data?.id === g?.id}
                    selectable={selectable}
                  />
                  {fields
                    ?.filter((i) => i?.screenId === g?.id)
                    .map((i) => {
                      if (activeItem?.data?.id === i?.id) {
                        if (
                          selectStatus !== NavbarSelectStatus.ON_WITHOUT_SELECT
                        ) {
                          selectable = true
                        }
                      }
                      return (
                        <SelectNavComponent
                          key={i?.id}
                          type="Field"
                          data={i as FormSystemField}
                          active={activeItem?.data?.id === i?.id}
                          selectable={selectable}
                        />
                      )
                    })}
                </Box>
              ))}
          </Box>
        ))}
    </div>
  )
}
