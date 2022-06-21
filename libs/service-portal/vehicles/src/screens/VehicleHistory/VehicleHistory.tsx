import React, { useState } from 'react'
import {
  ServicePortalModuleComponent,
  m,
  EmptyState,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { Query, VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  Table as T,
  LoadingDots,
  DatePicker,
  Checkbox,
} from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'
import { GET_USERS_VEHICLES_HISTORY } from '../../queries/getUsersVehicleHistory'
import HistoryTableData from './HistoryTableData'
import HistoryTableHeader from './HistoryTableHeader'
import * as styles from './VehicleHistory.css'

const getFilteredVehicles = (
  vehicles: VehiclesVehicle[],
  showDeregistered: boolean,
  fromDate?: Date,
  toDate?: Date,
): VehiclesVehicle[] => {
  let filteredVehicles = showDeregistered
    ? vehicles
    : vehicles.filter((x) => x.vehicleStatus?.toLowerCase() !== 'afskráð')

  if (fromDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      return (
        x.operatorStartDate &&
        new Date(x.operatorStartDate).getTime() >= fromDate.getTime()
      )
    })
  }

  if (toDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      return (
        x.operatorEndDate &&
        new Date(x.operatorEndDate).getTime() <= toDate.getTime()
      )
    })
  }

  return filteredVehicles
}

export const VehiclesHistory: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [checkbox, setCheckbox] = useState(false)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()

  const { data, loading, error, called } = useQuery<Query>(
    GET_USERS_VEHICLES_HISTORY,
  )
  const vehicles = data?.vehiclesHistoryList?.vehicleList || []
  const filteredVehicles = getFilteredVehicles(
    vehicles,
    checkbox,
    fromDate,
    toDate,
  )

  const headerLabels = [
    {
      value: formatMessage(messages.permno),
    },
    {
      value: formatMessage(messages.type),
    },
    {
      value: formatMessage(messages.firstReg),
    },
    {
      value: formatMessage(messages.baught),
    },
    {
      value: formatMessage(messages.sold),
    },
    {
      value: formatMessage(messages.innlogn),
    },
    {
      value: formatMessage(messages.status),
    },
  ]

  const filteredOwner = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'eigandi',
  )

  const filteredOperator = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'umráðamaður',
  )

  const filteredCoOwner = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === 'meðeigandi',
  )
  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(messages.historyTitle)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(messages.intro)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>

      <Stack space={2}>
        {!loading && !error && (
          <GridRow>
            <GridColumn
              span={['1/1', '8/12', '8/12', '3/12']}
              className={styles.dateColumn}
            >
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => setFromDate(d)}
                icon="calendar"
                iconType="outline"
                size="xs"
                label={formatMessage(m.dateFrom)}
                selected={fromDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '8/12', '8/12', '3/12']}
              offset={['0', '0', '0', '1/12', '0']}
              paddingTop={[2, 2, 2, 0, 0]}
              className={styles.dateColumn}
            >
              <DatePicker
                backgroundColor="blue"
                handleChange={(d) => setToDate(d)}
                icon="calendar"
                iconType="outline"
                size="xs"
                label={formatMessage(m.dateTo)}
                selected={toDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '8/12', '8/12', '3/12']}
              offset={['0', '0', '0', '1/12', '0']}
              paddingBottom={[2, 2, 2, 0, 0]}
            >
              <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                height="full"
                paddingTop={'p5'}
              >
                <Checkbox
                  label={formatMessage(messages.showDeregistered)}
                  checked={checkbox}
                  onChange={({ target }) => {
                    setCheckbox(target.checked)
                  }}
                />
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {error && (
          <Box>
            <EmptyState description={m.errorFetch} />
          </Box>
        )}
        {!loading && !error && filteredVehicles.length === 0 && (
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        )}

        {loading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="full"
            marginTop={6}
          >
            <LoadingDots large />
          </Box>
        )}

        {filteredOwner.length > 0 && (
          <Box width="full">
            <Text variant="h4" as="h2" marginBottom={2}>
              {formatMessage(messages.ownersHistory)}
            </Text>
            <T.Table>
              <HistoryTableHeader labels={headerLabels} />

              {filteredOwner.map((item, index) => {
                return <HistoryTableData key={index} vehicle={item} />
              })}
            </T.Table>
          </Box>
        )}

        {filteredCoOwner.length > 0 && (
          <Box width="full">
            <Text variant="h4" as="h2">
              {formatMessage(messages.coOwnerHistory)}
            </Text>
            <T.Table>
              <HistoryTableHeader labels={headerLabels} />

              {filteredCoOwner.map((item, index) => {
                return <HistoryTableData key={index} vehicle={item} />
              })}
            </T.Table>
          </Box>
        )}

        {filteredOperator.length > 0 && (
          <Box width="full">
            <Text variant="h4" as="h2">
              {formatMessage(messages.operatorHistory)}
            </Text>
            <T.Table>
              <HistoryTableHeader labels={headerLabels} />

              {filteredOperator.map((item, index) => {
                return <HistoryTableData key={index} vehicle={item} />
              })}
            </T.Table>
          </Box>
        )}
      </Stack>
    </>
  )
}

export default VehiclesHistory
