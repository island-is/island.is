import { FormSystemField } from '@island.is/api/schema'
import { Box, Select, Stack } from '@island.is/island-ui/core'
import { FamilyTypes } from '@island.is/form-system/enums'
import { useContext } from 'react'

import { ControlContext } from '../../../../../../../context/ControlContext'

const familyTypeOptions = [
  { label: 'Barn', value: FamilyTypes.CHILD },
  { label: 'Maki', value: FamilyTypes.SPOUSE },
  { label: 'Dánarbú', value: FamilyTypes.NATIONAL_ID_ESTATE },
]

export const FamilySettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const selected =
    familyTypeOptions.find(
      (option) => option.value === currentItem.fieldSettings?.familyType,
    ) ?? null

  return (
    <Stack space={2}>
      <Box width="half">
        <Select
          name="familyType"
          label="Tegund fjölskyldumeðlims"
          placeholder="Veldu tegund fjölskyldumeðlims"
          backgroundColor="blue"
          options={familyTypeOptions}
          value={selected}
          isDisabled={control.isReadOnly}
          onChange={(option) => {
            controlDispatch({
              type: 'SET_ANY_FIELD_SETTING',
              payload: {
                property: 'familyType',
                value: option?.value,
                update: updateActiveItem,
              },
            })
          }}
        />
      </Box>
    </Stack>
  )
}
