import { FormSystemField } from '@island.is/api/schema'
import { Box, Checkbox, Select, Stack } from '@island.is/island-ui/core'
import { useContext } from 'react'

import { ControlContext } from '../../../../../../../context/ControlContext'

const assetTypeOptions = [
  { label: 'Ökutæki', value: 'car' },
  { label: 'Fasteign', value: 'realEstate' },
  { label: 'Skip', value: 'ship' },
]

export const AssetsSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)

  const currentItem = control.activeItem.data as FormSystemField
  const selected =
    assetTypeOptions.find(
      (option) => option.value === currentItem.fieldSettings?.assetType,
    ) ?? null

  return (
    <Stack space={2}>
      <Box width="half">
        <Select
          name="assetType"
          label="Tegund eignar"
          placeholder="Veldu tegund eignar"
          backgroundColor="blue"
          options={assetTypeOptions}
          value={selected}
          isDisabled={control.isReadOnly}
          onChange={(option) => {
            controlDispatch({
              type: 'SET_ANY_FIELD_SETTING',
              payload: {
                property: 'assetType',
                value: option?.value,
                update: updateActiveItem,
              },
            })
          }}
        />
      </Box>
      <Checkbox
        name="isDropdown"
        label="Er dropdown"
        checked={currentItem.fieldSettings?.isDropdown ?? false}
        disabled={control.isReadOnly}
        onChange={(e) =>
          controlDispatch({
            type: 'SET_ANY_FIELD_SETTING',
            payload: {
              property: 'isDropdown',
              value: e.target.checked,
              update: updateActiveItem,
            },
          })
        }
      />
    </Stack>
  )
}
