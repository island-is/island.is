import { FieldBaseProps } from '@island.is/application/types'
import { Box, InputError } from '@island.is/island-ui/core'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { VehicleRadioField } from './VehicleRadioField'
import { useLocale } from '@island.is/localization'
import { error } from '../../lib/messages'
import { VehicleFindField } from './VehicleFindField'
import { VehicleSelectField } from './VehicleSelectField'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as CurrentVehiclesAndRecords
  return (
    <Box paddingTop={2}>
      {currentVehicleList.totalRecords > 20 ? (
        <VehicleFindField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      ) : currentVehicleList.totalRecords > 5 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      ) : (
        <VehicleRadioField
          currentVehicleList={currentVehicleList?.vehicles}
          {...props}
        />
      )}
      {(errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
