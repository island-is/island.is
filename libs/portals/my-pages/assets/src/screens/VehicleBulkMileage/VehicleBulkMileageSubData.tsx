import { VehiclesMileageRegistrationHistory } from '@island.is/api/schema'
import { Box, Button, Inline, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  LinkResolver,
  NestedFullTable,
  SimpleBarChart,
  formatDate,
  numberFormat,
} from '@island.is/portals/my-pages/core'
import format from 'date-fns/format'
import { useMemo, useState } from 'react'
import VehicleCO2 from '../../components/VehicleCO2'
import { vehicleMessage } from '../../lib/messages'
import { AssetsPaths } from '../../lib/paths'
import { displayWithUnit } from '../../utils/displayWithUnit'

interface Props {
  vehicleId: string
  data: VehiclesMileageRegistrationHistory
  loading?: boolean
  co2?: string
}

interface ChartProps {
  date: string
  mileage: number
}

const parseChartData = (
  data: VehiclesMileageRegistrationHistory,
): Array<Record<string, number | string>> => {
  const filteredData = data.mileageRegistrationHistory?.reduce<
    Record<string, ChartProps>
  >((acc, current) => {
    if (!current.mileage || !current.date || !current.originCode) {
      return acc
    }

    const currentDate = new Date(current.date).toISOString()
    //01.01.1993-ISLAND.IS
    const mashedKey = currentDate + '-' + current.originCode
    //If the "mashed" key isn't in the key array, add it.
    if (!Object.keys(acc).includes(mashedKey)) {
      acc[mashedKey] = { date: currentDate, mileage: current.mileage }
    }
    return acc
  }, {})

  if (!filteredData) {
    return []
  }

  return Object.values(filteredData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      date: format(new Date(item.date), 'dd.MM.yyyy'),
      mileage: item.mileage,
    }))
}

export const VehicleBulkMileageSubData = ({
  vehicleId,
  loading,
  data,
  co2,
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
          icon={displayMode === 'table' ? 'gridView' : 'menu'}
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
      ) : data.mileageRegistrationHistory ? (
        <SimpleBarChart
          data={parseChartData(data)}
          datakeys={['date', 'mileage']}
          bars={[
            {
              datakey: 'mileage',
            },
          ]}
          xAxis={{
            datakey: 'date',
          }}
          yAxis={{
            datakey: 'mileage',
            label: 'Km.',
          }}
          tooltip={{
            labels: {
              mileage: formatMessage(vehicleMessage.odometer),
            },
            valueFormat: (arg: number) => `${numberFormat(arg)} km`,
          }}
        />
      ) : undefined}
      <VehicleCO2 co2={co2 ?? '0'} />
      <Box marginTop={2}>
        <Inline space={1}>
          <LinkResolver
            href={AssetsPaths.AssetsVehiclesDetailMileage.replace(
              ':id',
              vehicleId.toString(),
            )}
          >
            <Button
              icon="arrowForward"
              iconType="outline"
              size="small"
              variant="utility"
              colorScheme="white"
            >
              {formatMessage(vehicleMessage.viewRegistrationHistory)}
            </Button>
          </LinkResolver>
        </Inline>
      </Box>
    </Box>
  )
}
