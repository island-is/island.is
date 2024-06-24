import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyTypes } from '../../../lib/constants'
import { useLocale } from '@island.is/localization'
import { propertySearch } from '../../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'

interface PropertyTypeProps {
  setPropertyType: React.Dispatch<
    React.SetStateAction<PropertyTypes | undefined>
  >
  propertyType: PropertyTypes | undefined
}

export const PropertyTypeSelectField: FC<
  React.PropsWithChildren<FieldBaseProps & PropertyTypeProps>
> = ({ field, setPropertyType }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={1}>
      <SelectController
        id={`${field.id}.propertyType`}
        label={formatMessage(propertySearch.labels.selectLabel)}
        placeholder={formatMessage(propertySearch.labels.selectPlaceholder)}
        backgroundColor="blue"
        onSelect={(option) => setPropertyType(option.value)}
        options={[
          {
            label: formatMessage(
              propertySearch.propertyTypes[PropertyTypes.REAL_ESTATE],
            ),
            value: PropertyTypes.REAL_ESTATE,
          },
          {
            label: formatMessage(
              propertySearch.propertyTypes[PropertyTypes.VEHICLE],
            ),
            value: PropertyTypes.VEHICLE,
          },
          {
            label: formatMessage(
              propertySearch.propertyTypes[PropertyTypes.SHIP],
            ),
            value: PropertyTypes.SHIP,
          },
        ]}
      />
    </Box>
  )
}
