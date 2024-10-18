import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { PropertyTypes } from '../../../lib/constants'
import { useLocale } from '@island.is/localization'
import { propertySearch } from '../../../lib/messages'
import { Box } from '@island.is/island-ui/core'
import { SelectController } from '@island.is/shared/form-fields'
import { getPropertySelectOptions } from '../../../util/getPropertySelectOptions'

interface PropertyTypeProps {
  setPropertyType: React.Dispatch<
    React.SetStateAction<PropertyTypes | undefined>
  >
  propertyType: PropertyTypes | undefined
}

export const PropertyTypeSelectField: FC<
  React.PropsWithChildren<FieldBaseProps & PropertyTypeProps> & {
    field: { props: { allowVehicle: boolean; allowShip: boolean } }
  }
> = ({ field, setPropertyType }) => {
  const { allowVehicle, allowShip } = field.props
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={1}>
      <SelectController
        id={`${field.id}.propertyType`}
        label={formatMessage(propertySearch.labels.selectLabel)}
        placeholder={formatMessage(propertySearch.labels.selectPlaceholder)}
        backgroundColor="blue"
        onSelect={(option) => setPropertyType(option.value)}
        options={getPropertySelectOptions(
          formatMessage,
          allowVehicle,
          allowShip,
        )}
      />
    </Box>
  )
}
