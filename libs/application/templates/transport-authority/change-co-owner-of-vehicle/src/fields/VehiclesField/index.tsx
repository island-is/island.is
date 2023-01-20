import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { VehiclesCurrentVehicle } from '../../types'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'

export const VehiclesField: FC<FieldBaseProps> = (props) => {
  const { application } = props
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
    </Box>
  )
}
