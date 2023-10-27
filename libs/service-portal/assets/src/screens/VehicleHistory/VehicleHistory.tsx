import isAfter from 'date-fns/isAfter'
import isEqual from 'lodash/isEqual'
import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Query, VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  m,
  SAMGONGUSTOFA_ID,
} from '@island.is/service-portal/core'

import { vehicleMessage as messages } from '../../lib/messages'
import TabContent from './TabContent'
import {
  VEHICLE_OPERATOR,
  VEHICLE_OWNER,
  VEHICLE_COOWNER,
} from '../../utils/constants'

export const GET_USERS_VEHICLES_HISTORY = gql`
  query GetUsersVehicles {
    vehiclesHistoryList {
      vehicleList {
        permno
        regno
        type
        color
        firstRegDate
        modelYear
        productYear
        role
        operatorStartDate
        operatorEndDate
        outOfUse
        otherOwners
        termination
        vehicleStatus
        plateStatus
        nextInspection {
          nextInspectionDate
          nextInspectionDateIfPassedInspectionToday
        }
        deregistrationDate
      }
    }
  }
`

const getFilteredVehicles = (
  vehicles: VehiclesVehicle[],
  showDeregistered: boolean,
  fromDate?: Date | null,
  toDate?: Date | null,
): VehiclesVehicle[] => {
  let filteredVehicles = showDeregistered
    ? vehicles
    : vehicles.filter((x) => x.vehicleStatus?.toLowerCase() !== 'afskráð')

  if (fromDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      const startDate =
        x.operatorStartDate &&
        new Date(x.operatorStartDate).setHours(0, 0, 0, 0)
      return (
        startDate &&
        (isAfter(startDate, fromDate.getTime()) ||
          isEqual(startDate, fromDate.getTime()))
      )
    })
  }

  if (toDate) {
    filteredVehicles = filteredVehicles.filter((x: VehiclesVehicle) => {
      const endDate =
        x.operatorEndDate && new Date(x.operatorEndDate).setHours(0, 0, 0, 0)
      return (
        endDate &&
        (isAfter(toDate.getTime(), endDate) ||
          isEqual(endDate, toDate.getTime()))
      )
    })
  }

  return filteredVehicles
}

const VehiclesHistory = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [checkbox, setCheckbox] = useState(false)
  const [fromDate, setFromDate] = useState<Date | null>()
  const [toDate, setToDate] = useState<Date | null>()

  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLES_HISTORY)
  const vehicles = data?.vehiclesHistoryList?.vehicleList || []
  const filteredVehicles = getFilteredVehicles(
    vehicles,
    checkbox,
    fromDate,
    toDate,
  )
  const filteredOwnersVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === VEHICLE_OWNER,
  )

  const filteredCoOwnerVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === VEHICLE_COOWNER,
  )

  const filteredOperatorVehicles = filteredVehicles.filter(
    (x: VehiclesVehicle) => x.role?.toLowerCase() === VEHICLE_OPERATOR,
  )

  const tabs = [
    {
      label: formatMessage(messages.ownersHistory),
      content: <TabContent data={filteredOwnersVehicles} />,
    },
    {
      label: formatMessage(messages.coOwnerHistory),
      content: <TabContent data={filteredCoOwnerVehicles} />,
    },
    {
      label: formatMessage(messages.operatorHistory),
      content: <TabContent data={filteredOperatorVehicles} />,
    },
  ]
  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.vehicles).toLowerCase(),
        })}
      />
    )
  }

  return (
    <>
      <IntroHeader
        title={messages.historyTitle}
        intro={messages.historyIntro}
        serviceProviderID={SAMGONGUSTOFA_ID}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />

      {!loading && !error && vehicles.length === 0 && (
        <Box marginTop={[0, 8]}>
          <EmptyState />
        </Box>
      )}
      <Stack space={2}>
        {!loading && !error && vehicles.length > 0 && (
          <GridRow rowGap={[1, 1, 2, 2, 'smallGutter']}>
            <GridColumn span={['1/1', '7/9', '6/9', '5/9', '3/9']}>
              <DatePicker
                backgroundColor="blue"
                handleChange={(d: Date) => setFromDate(d)}
                icon={{ name: 'calendar', type: 'outline' }}
                size="xs"
                label={formatMessage(messages.dateOfPurchase)}
                selected={fromDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '7/9', '6/9', '5/9', '3/9']}
              paddingTop={[1, 1, 2, 0, 0]}
            >
              <DatePicker
                backgroundColor="blue"
                handleChange={(d: Date) => setToDate(d)}
                icon={{ name: 'calendar', type: 'outline' }}
                size="xs"
                label={formatMessage(messages.dateOfSale)}
                selected={toDate}
                locale="is"
                placeholderText={formatMessage(m.chooseDate)}
              />
            </GridColumn>
            <GridColumn
              span={['1/1', '7/9', '6/9', '5/9', '3/9']}
              offset={['0', '0', '0', '0', '0']}
              paddingBottom={[1, 1, 2, 0, 0]}
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

        {!loading &&
          !error &&
          vehicles.length > 0 &&
          filteredVehicles.length === 0 && (
            <Box display="flex" justifyContent="center" margin={[3, 3, 3, 6]}>
              <Text variant="h3" as="h3">
                {formatMessage(messages.noVehiclesFound)}
              </Text>
            </Box>
          )}

        {loading && (
          <Box padding={3}>
            <SkeletonLoader space={1} height={40} repeat={5} />
          </Box>
        )}
        {!loading && !error && filteredVehicles.length > 0 && (
          <Box marginTop={[0, 0, 5]}>
            <Tabs
              label={formatMessage(messages.chooseHistoryType)}
              tabs={tabs}
              contentBackground="transparent"
              selected="0"
              size="xs"
            />
          </Box>
        )}
      </Stack>
    </>
  )
}

export default VehiclesHistory
