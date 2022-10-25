import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'

export const VehiclesField: FC<FieldBaseProps> = ({ application }) => {
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  console.log(application)
  console.log(currentVehicleList)
  return (
    <Box paddingTop={2}>
      {currentVehicleList.length > 10 ? (
        <VehicleSelectField currentVehicleList={currentVehicleList} />
      ) : (
        <VehicleRadioField currentVehicleList={currentVehicleList} />
      )}
    </Box>
  )
}
