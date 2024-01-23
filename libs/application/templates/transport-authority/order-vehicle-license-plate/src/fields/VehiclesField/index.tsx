import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { CurrentVehiclesAndRecords } from '../../shared'
import { VehicleRadioField } from './VehicleRadioField'
import { VehicleFindField } from './VehicleFindField'

export const VehiclesField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as CurrentVehiclesAndRecords
  return (
    <Box paddingTop={2}>
      {currentVehicleList.totalRecords > 5 ? (
        <VehicleFindField
          currentVehicleList={currentVehicleList.vehicles}
          {...props}
        />
      ) : (
        // currentVehicleList.totalRecords > 5 ? (
        //   <VehicleSelectField
        //     currentVehicleList={currentVehicleList.vehicles}
        //     {...props}
        //   />
        // ) :
        <VehicleRadioField
          currentVehicleList={currentVehicleList?.vehicles}
          {...props}
        />
      )}
    </Box>
  )
}
