import React, { FC } from 'react'

import { Text, Table as T } from '@island.is/island-ui/core'
import { VehiclesVehicle } from '@island.is/api/schema'

interface Props {
  vehicle: VehiclesVehicle
}

export const HistoryTableData: FC<Props> = ({ vehicle }) => {
  return (
    <T.Body>
      <T.Row>
        <T.Data>
          <Text variant="medium">{vehicle.permno}</Text>
        </T.Data>

        <T.Data>
          <Text variant="medium">{vehicle.type}</Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.firstRegDate &&
              new Date(vehicle.firstRegDate).toLocaleDateString()}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.operatorStartDate &&
              new Date(vehicle.operatorStartDate).toLocaleDateString()}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.operatorEndDate &&
              new Date(vehicle.operatorEndDate).toLocaleDateString()}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.deregistrationDate &&
              new Date(vehicle.deregistrationDate).toLocaleDateString()}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">{vehicle.vehicleStatus}</Text>
        </T.Data>
      </T.Row>
    </T.Body>
  )
}

export default HistoryTableData
