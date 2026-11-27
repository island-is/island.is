import { FormSystemField } from '@island.is/api/schema'
import { Box, Select, Text } from '@island.is/island-ui/core'
import { FamilyTypes } from '@island.is/form-system/enums'
import { useContext, useEffect } from 'react'

import { ControlContext } from '../../../../../../../context/ControlContext'

const familyTypeOptions = [
  { label: 'Umsækjandi', value: FamilyTypes.APPLICANT_INFO },
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

  useEffect(() => {
    if (
      !control.isReadOnly &&
      currentItem.isPartOfMultiset &&
      selected?.value === FamilyTypes.CHILD
    ) {
      controlDispatch({
        type: 'CHANGE_IS_PART_OF_MULTI',
        payload: { update: updateActiveItem },
      })
    }
  }, [
    control.isReadOnly,
    controlDispatch,
    currentItem.isPartOfMultiset,
    selected?.value,
    updateActiveItem,
  ])

  return (
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
      {selected?.value === FamilyTypes.CHILD && (
        <Box marginTop={2}>
          <Text variant="small">
            Í listanum birtast börn sem umsækjandi fer með forsjá yfir samkvæmt
            Þjóðskrá. Börn sem umsækjandi fer ekki með forsjá yfir birtast ekki
            í listanum.
          </Text>
        </Box>
      )}
    </Box>
  )
}
