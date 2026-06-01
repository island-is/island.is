import { Box, Hidden, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyTable, ExpandHeader } from '@island.is/portals/my-pages/core'
import { useMemo } from 'react'
import { vehicleMessage } from '../../../lib/messages'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { OdometerUnit, VehicleType } from '../types'
import { VehicleBulkMileageMobileRow } from './VehicleBulkMileageMobileRow'
import { VehicleBulkMileageMobileCardRow } from './VehicleBulkMileageMobileCardRow'

interface Props {
  vehicles: Array<VehicleType>
  loading: boolean
  onMileageUpdateCallback?: () => void
}

const VehicleBulkMileageMobileTable = ({
  vehicles,
  loading,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage } = useLocale()

  const desktopRows = useMemo(
    () =>
      vehicles.map((item) => (
        <VehicleBulkMileageMobileRow
          key={`desktop-vehicle-row-${item.vehicleId}`}
          vehicle={item}
          onMileageUpdateCallback={onMileageUpdateCallback}
        />
      )),
    [onMileageUpdateCallback, vehicles],
  )

  const mobileRows = useMemo(
    () =>
      vehicles.map((item) => (
        <VehicleBulkMileageMobileCardRow
          key={`mobile-vehicle-row-${item.vehicleId}`}
          vehicle={item}
          onMileageUpdateCallback={onMileageUpdateCallback}
        />
      )),
    [onMileageUpdateCallback, vehicles],
  )

  const totalLastMileage = useMemo(() => {
    if (!vehicles.length) return 0
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

  const totalDisplay = totalUnit
    ? displayWithUnit(totalLastMileage, totalUnit, true)
    : '-'

  return (
    <Box>
      <form>
        {/* ── Desktop view ─────────────────────────────────────── */}
        <Hidden below="md">
          {desktopRows && !loading && (
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
                {desktopRows}
                {desktopRows.length > 0 && (
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
                          {totalDisplay}
                        </Text>
                      </Box>
                    </td>
                    <td />
                  </T.Row>
                )}
              </T.Body>
            </T.Table>
          )}
          {(!desktopRows.length || loading) && (
            <EmptyTable
              loading={loading}
              message={formatMessage(vehicleMessage.noVehiclesFound)}
            />
          )}
        </Hidden>

        {/* ── Mobile view ──────────────────────────────────────── */}
        <Hidden above="sm">
          {!loading && mobileRows.length > 0 && (
            <Box>
              {mobileRows}
              <Box
                display="flex"
                justifyContent="spaceBetween"
                background="blue100"
                borderRadius="large"
                padding={2}
                marginTop={2}
              >
                <Text fontWeight="semiBold">
                  {formatMessage(vehicleMessage.total)}
                </Text>
                <Text fontWeight="semiBold">{totalDisplay}</Text>
              </Box>
            </Box>
          )}
          {(!mobileRows.length || loading) && (
            <EmptyTable
              loading={loading}
              message={formatMessage(vehicleMessage.noVehiclesFound)}
            />
          )}
        </Hidden>
      </form>
    </Box>
  )
}

export default VehicleBulkMileageMobileTable
