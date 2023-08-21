import React, { FC } from 'react'

import { Locale } from '@island.is/shared/types'
import { Text, Table as T } from '@island.is/island-ui/core'
import { VehiclesVehicle } from '@island.is/api/schema'
import { getDateLocale } from '../../utils/constants'

interface Props {
  vehicle: VehiclesVehicle
  locale: Locale
}

export const HistoryTableData: FC<React.PropsWithChildren<Props>> = ({
  vehicle,
  locale,
}) => {
  const dateLocale = getDateLocale(locale)
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
              new Date(vehicle.firstRegDate).toLocaleDateString(dateLocale)}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.operatorStartDate &&
              new Date(vehicle.operatorStartDate).toLocaleDateString(
                dateLocale,
              )}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.operatorEndDate &&
              new Date(vehicle.operatorEndDate).toLocaleDateString(dateLocale)}
          </Text>
        </T.Data>
        <T.Data>
          <Text variant="medium">
            {vehicle.deregistrationDate &&
              new Date(vehicle.deregistrationDate).toLocaleDateString(
                dateLocale,
              )}
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
