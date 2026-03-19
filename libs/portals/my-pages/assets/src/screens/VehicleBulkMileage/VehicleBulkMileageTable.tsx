import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyTable, ExpandHeader } from '@island.is/portals/my-pages/core'
import { useMemo } from 'react'
import { vehicleMessage } from '../../lib/messages'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { OdometerUnit, VehicleType } from './types'
import { VehicleBulkMileageRow } from './VehicleBulkMileageRow'

interface Props {
  vehicles: Array<VehicleType>
  loading: boolean
  onMileageUpdateCallback?: () => void
}

const VehicleBulkMileageTable = ({
  vehicles,
  loading,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage } = useLocale()

  const rows = useMemo(() => {
    return vehicles.map((item) => (
      <VehicleBulkMileageRow
        key={`vehicle-row-${item.vehicleId}`}
        vehicle={item}
        onMileageUpdateCallback={onMileageUpdateCallback}
      />
    ))
  }, [onMileageUpdateCallback, vehicles])

  const totalLastMileage = useMemo(() => {
    if (!vehicles.length) {
      return 0
    }

    return vehicles.reduce(
      (totalMileage, vehicle) =>
        totalMileage + (vehicle.lastMileageRegistration?.mileage ?? 0),
      0,
    )
  }, [vehicles])

  const totalUnit = useMemo((): OdometerUnit | undefined => {
    const units = new Set(
      vehicles.map((v) => (v.hasMilesOdometer ? 'mi' : 'km')),
    )
    if (units.size !== 1) return undefined
    return units.has('mi') ? 'mi' : 'km'
  }, [vehicles])

  return (
    <Box>
      <form>
        {rows && !loading && (
          <T.Table>
            <ExpandHeader
              data={[
                { value: '', printHidden: true },
                { value: formatMessage(vehicleMessage.type) },
                { value: formatMessage(vehicleMessage.lastRegistered) },
                { value: formatMessage(vehicleMessage.lastStatus) },
                { value: formatMessage(vehicleMessage.odometerBulkColumn) },
                { value: '', printHidden: true },
              ]}
            />
            <T.Body>
              {rows}
              {rows.length > 0 && (
                <T.Row>
                  <td>
                    <Box marginTop={2}>
                      <Text variant="medium" fontWeight="semiBold">
                        {formatMessage(vehicleMessage.total)}
                      </Text>
                    </Box>
                  </td>
                  <td />
                  <td />
                  <td>
                    <Box padding={2}>
                      <Text variant="medium" fontWeight="semiBold">
                        {totalUnit
                          ? displayWithUnit(totalLastMileage, totalUnit, true)
                          : '-'}
                      </Text>
                    </Box>
                  </td>
                  <td />
                </T.Row>
              )}
            </T.Body>
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
