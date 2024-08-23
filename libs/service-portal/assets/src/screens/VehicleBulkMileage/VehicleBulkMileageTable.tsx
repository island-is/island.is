import { Table as T, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ExpandHeader,
  NestedFullTable,
  formatDate,
} from '@island.is/service-portal/core'
import { vehicleMessage } from '../../lib/messages'
import { VehicleBulkMileageRow } from './VehicleBulkMileageRow'
import { useVehicleBulkMileageContext } from './VehicleBulkMileageContext'
import { useMemo } from 'react'

const VehicleBulkMileageTable = () => {
  const { formatMessage } = useLocale()
  const { vehicles } = useVehicleBulkMileageContext()

  const rows = useMemo(() => {
    return vehicles.map((item) => (
      <VehicleBulkMileageRow
        key={`vehicle-row-${item.vehicleId}`}
        vehicleId={item.vehicleId}
      >
        <NestedFullTable
          headerArray={[
            formatMessage(vehicleMessage.date),
            formatMessage(vehicleMessage.registration),
            formatMessage(vehicleMessage.annualUsage),
            formatMessage(vehicleMessage.odometer),
          ]}
          data={
            item.registrationHistory?.map((r) => [
              formatDate(r.date),
              r.origin,
              '-',
              r.mileage.toString(),
            ]) ?? []
          }
        />
      </VehicleBulkMileageRow>
    ))
  }, [formatMessage, vehicles])

  return (
    <Box>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '', printHidden: true },
            { value: formatMessage(vehicleMessage.type) },
            { value: formatMessage(vehicleMessage.permno) },
            { value: formatMessage(vehicleMessage.lastRegistration) },
            { value: formatMessage(vehicleMessage.odometer) },
            { value: '', printHidden: true },
          ]}
        />
        <T.Body>{rows}</T.Body>
      </T.Table>
    </Box>
  )
}

export default VehicleBulkMileageTable
