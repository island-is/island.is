import { FormSystemField } from '@island.is/api/schema'
import {
  Box,
  Select,
  Stack,
  GridColumn as Column,
  RadioButton,
} from '@island.is/island-ui/core'
import { useContext } from 'react'

import { ControlContext } from '../../../../../../../context/ControlContext'
import { AssetTypes, FieldTypesEnum } from '@island.is/form-system/enums'

const assetTypeOptions = [
  {
    label: 'Fasteign',
    value: AssetTypes.REAL_ESTATE,
    fieldType: FieldTypesEnum.REAL_ESTATE,
  },
  {
    label: 'Ökutæki',
    value: AssetTypes.VEHICLE,
    fieldType: FieldTypesEnum.VEHICLE,
  },
  //   { label: 'Skip', value: AssetTypes.SHIP },
]

export const AssetsSettings = () => {
  const { control, controlDispatch, updateActiveItem, fieldTypes } =
    useContext(ControlContext)
  const { isReadOnly, activeItem } = control
  const currentItem = activeItem.data as FormSystemField
  const isDropdown = currentItem.fieldSettings?.isDropdown ?? false

  const visibleAssetTypeOptions = assetTypeOptions.filter((option) =>
    fieldTypes?.some((fieldType) => fieldType?.id === option.fieldType),
  )

  const selected =
    visibleAssetTypeOptions.find(
      (option) => option.value === currentItem.fieldSettings?.assetType,
    ) ?? null

  const radioName = `lookupMode-${currentItem.id}`

  let isDropdownLabel = 'Birta lista af eignum'
  if (currentItem.fieldSettings?.assetType === AssetTypes.VEHICLE) {
    isDropdownLabel = 'Birta lista af eigin ökutækjum'
  } else if (currentItem.fieldSettings?.assetType === AssetTypes.REAL_ESTATE) {
    isDropdownLabel = 'Birta lista af eigin fasteignum'
  }

  let notDropdownLabel = 'Slá inn númer eignar handvirkt'
  if (currentItem.fieldSettings?.assetType === AssetTypes.VEHICLE) {
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
          options={visibleAssetTypeOptions}
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
      {(selected?.value === AssetTypes.VEHICLE ||
        selected?.value === AssetTypes.REAL_ESTATE) && (
        <>
          <Column span="6/10">
            <RadioButton
              id={`${radioName}-isDropdown`}
              name={radioName}
              label={isDropdownLabel}
              disabled={isReadOnly}
              checked={isDropdown}
              onChange={() => {
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
