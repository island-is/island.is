import { Table as T, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyTable, ExpandHeader } from '@island.is/portals/my-pages/core'
import { vehicleMessage } from '../../lib/messages'
import { useMemo } from 'react'
import { VehicleType } from './types'
import { VehicleBulkMileageRow } from './VehicleBulkMileageRow'

interface Props {
  vehicles: Array<VehicleType>
  loading: boolean
}

const VehicleBulkMileageTable = ({ vehicles, loading }: Props) => {
  const { formatMessage } = useLocale()

  const rows = useMemo(() => {
    return vehicles.map((item) => (
      <VehicleBulkMileageRow
        key={`vehicle-row-${item.vehicleId}`}
        vehicle={item}
      />
    ))
  }, [formatMessage, vehicles])

  return (
    <Box>
      <form>
        {rows && !loading && (
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
        )}
        {(!rows.length || loading) && (
          <EmptyTable
            loading={loading}
            message={formatMessage(vehicleMessage.noVehiclesFound)}
          />
        )}
      </form>
    </Box>
  )
}

export default VehicleBulkMileageTable
