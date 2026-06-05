import { FormSystemField } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  Select,
  Stack,
  GridColumn as Column,
  RadioButton,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'

import { ControlContext } from '../../../../../../../context/ControlContext'
import { AssetTypes } from '@island.is/form-system/enums'

const assetTypeOptions = [
  //   { label: 'Fasteign', value: AssetTypes.REAL_ESTATE },
  { label: 'Ökutæki', value: AssetTypes.CAR },
  //   { label: 'Skip', value: AssetTypes.SHIP },
]

export const AssetsSettings = () => {
  const { control, controlDispatch, updateActiveItem } =
    useContext(ControlContext)
  const { isReadOnly, activeItem } = control

  const currentItem = activeItem.data as FormSystemField
  const [isDropdown, setIsDropdown] = useState(
    currentItem.fieldSettings?.isDropdown ?? false,
  )
  const selected =
    assetTypeOptions.find(
      (option) => option.value === currentItem.fieldSettings?.assetType,
    ) ?? null

  const radioName = `lookupMode-${currentItem.id}`

  let isDropdownLabel = 'Birta lista af eignum'
  if (currentItem.fieldSettings?.assetType === AssetTypes.CAR) {
    isDropdownLabel = 'Birta lista af eigin ökutækjum'
  } else if (currentItem.fieldSettings?.assetType === AssetTypes.REAL_ESTATE) {
    isDropdownLabel = 'Birta lista af eigin fasteignum'
  }

  let notDropdownLabel = 'Slá inn númer eignar handvirkt'
  if (currentItem.fieldSettings?.assetType === AssetTypes.CAR) {
    notDropdownLabel = 'Slá inn skráningarnúmer ökutækis handvirkt'
  } else if (currentItem.fieldSettings?.assetType === AssetTypes.REAL_ESTATE) {
    notDropdownLabel = 'Slá inn númer fasteignar handvirkt'
  }

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
      {selected?.value === AssetTypes.CAR && (
        <>
          <Column span="6/10">
            <RadioButton
              id={`${radioName}-isDropdown`}
              name={radioName}
              label={isDropdownLabel}
              disabled={isReadOnly}
              checked={isDropdown}
              onChange={() => {
                setIsDropdown(true)
                controlDispatch({
                  type: 'SET_ANY_FIELD_SETTING',
                  payload: {
                    property: 'isDropdown',
                    value: true,
                    update: updateActiveItem,
                  },
                })
              }}
            />
          </Column>
          <Column span="6/10">
            <RadioButton
              id={`${radioName}-notDropdown`}
              name={radioName}
              label={notDropdownLabel}
              disabled={isReadOnly}
              checked={!isDropdown}
              onChange={() => {
                setIsDropdown(false)
                controlDispatch({
                  type: 'SET_ANY_FIELD_SETTING',
                  payload: {
                    property: 'isDropdown',
                    value: false,
                    update: updateActiveItem,
                  },
                })
              }}
            />
          </Column>
        </>
      )}
    </Stack>
  )
}
