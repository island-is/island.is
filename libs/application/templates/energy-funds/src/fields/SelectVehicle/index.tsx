import { Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import {} from '@island.is/localization'
import { FC } from 'react'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleCheckboxField } from './VehicleChekboxField'

export const SelectVehicle: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  console.log('application', application)
  const {
    externalData: { currentVehicles },
  } = application
  const vehicles = currentVehicles
    ? (currentVehicles.data as VehiclesCurrentVehicle[])
    : []

  return (
    <Box paddingTop={2}>
      {vehicles.length > 0 ? (
        <VehicleSelectField currentVehicleList={vehicles} {...props} />
      ) : (
        <VehicleCheckboxField currentVehicleList={vehicles} {...props} />
      )}
      {/* {(errors as any)?.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )} */}
    </Box>
  )
}
