import { useCallback, useMemo, useState } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Table,
  createColumnHelper,
  useIsMobile,
  type Row,
} from '@island.is/portals/my-pages/core'
import type { CellContext } from '@tanstack/react-table'
import format from 'date-fns/format'
import { vehicleMessage } from '../../../lib/messages'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { OdometerUnit, VehicleType } from '../types'
import { VehicleBulkMileageActionCell } from './VehicleBulkMileageActionCell'
import { VehicleBulkMileageHistoryRow } from './VehicleBulkMileageHistoryRow'

interface Props {
  vehicles: Array<VehicleType>
  loading: boolean
  onMileageUpdateCallback?: () => void
}

const columnHelper = createColumnHelper<VehicleType>()

const makeVehicleInfoCell =
  (isMobile: boolean) =>
  ({ row }: CellContext<VehicleType, unknown>) =>
    (
      <Box>
        <Text
          variant={isMobile ? 'h4' : 'medium'}
          as={isMobile ? 'h2' : 'p'}
          color={isMobile ? 'blue400' : 'dark400'}
          translate="no"
        >
          {row.original.vehicleType}
        </Text>
        <Text
          variant={isMobile ? 'medium' : 'small'}
          color={isMobile ? 'dark300' : 'dark400'}
          translate="no"
          as="span"
        >
          {row.original.vehicleId}
        </Text>
      </Box>
    )

const VehicleBulkMileageMobileTable = ({
  vehicles,
  loading,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage, locale } = useLocale()
  const { isMobile } = useIsMobile()
  const [refreshMap, setRefreshMap] = useState<Record<string, number>>({})

  const onSaveSuccess = useCallback((vehicleId: string) => {
    setRefreshMap((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] ?? 0) + 1,
    }))
  }, [])

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'vehicleInfo',
        header: formatMessage(vehicleMessage.type),
        cell: makeVehicleInfoCell(isMobile),
        meta: { noTextWrapper: true },
        enableSorting: false,
      }),
      columnHelper.display({
        id: 'lastRegistered',
        header: formatMessage(vehicleMessage.lastRegistered),
        cell: ({ row }) => {
          const date = row.original.lastMileageRegistration?.date
          return date ? format(new Date(date), 'dd.MM.yyyy') : '-'
        },
        enableSorting: false,
      }),
      columnHelper.display({
        id: 'lastStatus',
        header: formatMessage(vehicleMessage.lastStatus),
        cell: ({ row }) => {
          const mileage = row.original.lastMileageRegistration?.mileage
          const unit: OdometerUnit = row.original.hasMilesOdometer ? 'mi' : 'km'
          return mileage != null ? displayWithUnit(mileage, unit, true) : '-'
        },
        enableSorting: false,
      }),
      columnHelper.display({
        id: 'action',
        header: formatMessage(vehicleMessage.odometerBulkColumn),
        cell: VehicleBulkMileageActionCell,
        meta: { noTextWrapper: true, mobileFullWidth: true },
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, isMobile],
  )

  const renderExpandedRow = useCallback(
    (row: Row<VehicleType>) => {
      const unit: OdometerUnit = row.original.hasMilesOdometer ? 'mi' : 'km'
      return (
        <VehicleBulkMileageHistoryRow
          vehicle={row.original}
          unit={unit}
          refreshTrigger={refreshMap[row.original.vehicleId] ?? 0}
        />
      )
    },
    [refreshMap],
  )

  const totalLastMileage = useMemo(
    () =>
      vehicles.reduce(
        (total, v) => total + (v.lastMileageRegistration?.mileage ?? 0),
        0,
      ),
    [vehicles],
  )

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
      <form aria-label={formatMessage(vehicleMessage.vehicleMileageInputTitle)}>
        <Table
          columns={columns}
          data={vehicles}
          loading={loading}
          emptyMessage={formatMessage(vehicleMessage.noVehiclesFound)}
          mobileTitleKey="vehicleInfo"
          renderExpandedRow={renderExpandedRow}
          getRowId={(v) => v.vehicleId}
          meta={{ onMileageUpdateCallback, onSaveSuccess }}
        />
        {vehicles.length > 0 && !loading && (
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
        )}
      </form>
    </Box>
  )
}

export default VehicleBulkMileageMobileTable
