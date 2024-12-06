import {
  LinkResolver,
  NestedFullTable,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { AssetsPaths } from '../../lib/paths'
import { vehicleMessage } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useMemo, useState } from 'react'
import { VehiclesMileageRegistrationHistory } from '@island.is/api/schema'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { LineChart } from './LineChart'

interface Props {
  vehicleId: string
  data: VehiclesMileageRegistrationHistory
  loading?: boolean
}

export const VehicleBulkMileageSubData = ({
  vehicleId,
  loading,
  data,
}: Props) => {
  const { formatMessage } = useLocale()

  const [displayMode, setDisplayMode] = useState<'chart' | 'table'>('table')

  const nestedTable = useMemo(() => {
    if (!data) {
      return [[]]
    }
    const tableData: Array<Array<string>> = [[]]
    for (const mileageRegistration of data.mileageRegistrationHistory?.slice(
      0,
      5,
    ) ?? []) {
      if (mileageRegistration) {
        tableData.push([
          formatDate(mileageRegistration.date),
          mileageRegistration.originCode,
          displayWithUnit(mileageRegistration.mileage, 'km', true),
        ])
      }
    }

    return tableData
  }, [data])

  return (
    <Box paddingX={3} paddingY={2} background="blue100">
      <Box display="flex" justifyContent="spaceBetween">
        <Text fontWeight="semiBold">
          {formatMessage(vehicleMessage.registrationHistory)}
        </Text>
        <Button
          size="small"
          variant="utility"
          icon={displayMode === 'table' ? 'gridView' : 'listView'}
          colorScheme="white"
          onClick={() =>
            setDisplayMode(displayMode === 'table' ? 'chart' : 'table')
          }
        >
          {displayMode === 'table'
            ? formatMessage(vehicleMessage.viewChart)
            : formatMessage(vehicleMessage.viewTable)}
        </Button>
      </Box>
      {displayMode === 'table' ? (
        <NestedFullTable
          headerArray={[
            formatMessage(vehicleMessage.date),
            formatMessage(vehicleMessage.registration),
            formatMessage(vehicleMessage.odometer),
          ]}
          loading={loading}
          emptyMessage={formatMessage(vehicleMessage.mileageHistoryNotFound)}
          data={nestedTable}
        />
      ) : (
        <LineChart />
      )}
      <Box marginTop={2}>
        <LinkResolver
          href={AssetsPaths.AssetsVehiclesDetailMileage.replace(
            ':id',
            vehicleId.toString(),
          )}
        >
          <Button
            colorScheme="white"
            icon="arrowForward"
            iconType="outline"
            size="small"
            variant="utility"
          >
            {formatMessage(vehicleMessage.viewRegistrationHistory)}
          </Button>
        </LinkResolver>
      </Box>
    </Box>
  )
}
