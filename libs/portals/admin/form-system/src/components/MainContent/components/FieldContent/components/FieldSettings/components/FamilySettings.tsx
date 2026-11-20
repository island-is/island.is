import { FormSystemField } from '@island.is/api/schema'
import { Box, Checkbox, Select, Stack } from '@island.is/island-ui/core'
import { FamilyTypes } from '@island.is/form-system/enums'
import { useContext } from 'react'

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
      {currentItem.fieldSettings?.familyType === FamilyTypes.CHILD && (
        <Stack space={2}>
          <Checkbox
            large
            label="Sýna kynbörn"
            subLabel="Sýnir kynbörn viðkomandi samkvæmt Þjóðskrá, óháð forsjá."
            checked={currentItem.fieldSettings?.showBiologicalChildren ?? true}
            disabled={control.isReadOnly}
            onChange={(event) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'showBiologicalChildren',
                  value: event.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
          <Checkbox
            large
            label="Sýna börn í forsjá"
            subLabel="Sýnir börn sem viðkomandi fer með forsjá yfir samkvæmt Þjóðskrá, óháð skyldleika."
            checked={currentItem.fieldSettings?.showChildrenInCustody ?? true}
            disabled={control.isReadOnly}
            onChange={(event) =>
              controlDispatch({
                type: 'SET_ANY_FIELD_SETTING',
                payload: {
                  property: 'showChildrenInCustody',
                  value: event.target.checked,
                  update: updateActiveItem,
                },
              })
            }
          />
        </Stack>
      )}
    </Stack>
  )
}
