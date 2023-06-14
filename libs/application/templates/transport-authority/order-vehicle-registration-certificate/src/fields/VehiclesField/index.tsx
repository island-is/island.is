import { FieldBaseProps } from '@island.is/application/types'
import { Box, InputError } from '@island.is/island-ui/core'
import { FC } from 'react'
import { VehiclesCurrentVehicle } from '../../shared'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useLocale } from '@island.is/localization'
import { error } from '../../lib/messages'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  return (
    <Box paddingTop={2}>
      {currentVehicleList.length > 10 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList}
          {...props}
        />
      ) : (
        <VehicleRadioField currentVehicleList={currentVehicleList} {...props} />
      )}
      {(errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
