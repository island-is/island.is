import isEqual from 'lodash/isEqual'
import React, { useCallback, useState } from 'react'

import { gql, useQuery } from '@apollo/client'
import { Query, VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  formSubmit,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { VehicleCard } from '../../components/VehicleCard'
import { messages, urls } from '../../lib/messages'
import DropdownExport from '../../components/DropdownExport/DropdownExport'
import { exportVehicleOwnedDocument } from '../../utils/vehicleOwnedMapper'

export const GET_USERS_VEHICLES = gql`
  query GetUsersVehicles {
    vehiclesList {
      persidno
      name
      address
      postStation
      vehicleList {
        isCurrent
        permno
        regno
        vin
        type
        color
        firstRegDate
        modelYear
        productYear
        registrationType
        role
        operatorStartDate
        operatorEndDate
        outOfUse
        otherOwners
        termination
        buyerPersidno
        ownerPersidno
        vehicleStatus
        useGroup
        vehGroup
        plateStatus
        nextInspection {
          nextInspectionDate
          nextInspectionDateIfPassedInspectionToday
        }
        operatorNumber
        primaryOperator
        ownerSsid
        ownerName
        lastInspectionResult
        lastInspectionDate
        lastInspectionType
        nextInspectionDate
      }
      downloadServiceURL
      createdTimestamp
    }
  }
`

const defaultFilterValues = {
  searchQuery: '',
}
type FilterValues = {
  searchQuery: string
}

const getFilteredVehicles = (
  vehicles: VehiclesVehicle[],
  filterValues: FilterValues,
): VehiclesVehicle[] => {
  const { searchQuery } = filterValues

  if (searchQuery) {
    return vehicles.filter(
      (x: VehiclesVehicle) =>
        x.permno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.regno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.type?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }
  return vehicles
}

const VehiclesOverview = () => {
  useNamespaces('sp.vehicles')
  const userInfo = useUserInfo()
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [searchInteractionEventSent, setSearchInteractionEventSent] =
    useState(false)
  const [filterValue, setFilterValue] =
    useState<FilterValues>(defaultFilterValues)
  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLES)
  const ownershipPdf = data?.vehiclesList?.downloadServiceURL
  const vehicles = data?.vehiclesList?.vehicleList || []
  const filteredVehicles = getFilteredVehicles(vehicles, filterValue)
  const handleSearchChange = useCallback((value: string) => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues, searchQuery: value })
    if (!searchInteractionEventSent) {
      setSearchInteractionEventSent(true)
    }
  }, [])

  const vehiclesFoundText = () =>
    filteredVehicles.length === 1 ||
    (lang === 'is' && filteredVehicles.length % 10 === 1)
      ? formatMessage(messages.foundSingular)
      : formatMessage(messages.found)
  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

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
      <IntroHeader title={messages.title} intro={messages.intro} />

      {!loading && !error && vehicles.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}

      {!loading && !error && filteredVehicles.length > 0 && (
        <Box marginBottom={3} display="flex" flexWrap="wrap">
          {!loading && ownershipPdf && (
            <Box marginRight={2} marginBottom={[1, 1, 1, 1]}>
              <DropdownExport
                onGetPDF={() => formSubmit(`${ownershipPdf}`)}
                onGetExcel={() =>
                  exportVehicleOwnedDocument(
                    filteredVehicles,
                    formatMessage(messages.myCarsFiles),
                    data?.vehiclesList?.name ?? userInfo.profile.name,
                    data?.vehiclesList?.persidno ?? userInfo.profile.nationalId,
                  )
                }
              />
            </Box>
          )}
          <Box paddingRight={2} marginBottom={[1, 1, 1, 1]}>
            <a
              href={formatMessage(urls.ownerChange)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                colorScheme="default"
                icon="open"
                iconType="outline"
                size="default"
                type="button"
                variant="utility"
              >
                {formatMessage(messages.changeOfOwnership)}
              </Button>
            </a>
          </Box>
          <Box marginRight={2} marginBottom={[1, 1, 1, 1]}>
            <a
              href="/app/skilavottord/my-cars"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="utility"
                size="small"
                icon="reader"
                iconType="outline"
              >
                {formatMessage(messages.recycleCar)}
              </Button>
            </a>
          </Box>
          <Box marginBottom={[1, 1, 1, 1]}>
            <a
              href={formatMessage(urls.hideName)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="utility"
                size="small"
                icon="eyeOff"
                iconType="outline"
              >
                {formatMessage(messages.vehicleNameSecret)}
              </Button>
            </a>
          </Box>
        </Box>
      )}
      <Stack space={2}>
        {!loading && !error && vehicles.length > 4 && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
              <Box marginBottom={1}>
                <Input
                  icon={{ name: 'search' }}
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => handleSearchChange(ev.target.value)}
                  name="okutaeki-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchPlaceholder)}
                />
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {hasActiveFilters() && (
          <GridRow>
            <GridColumn span={['12/12', '12/12']}>
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                >
                  <Text variant="h5" as="h3">{`${
                    filteredVehicles.length
                  } ${formatMessage(vehiclesFoundText())}`}</Text>
                  <div>
                    <Button variant="text" onClick={handleClearFilters}>
                      {formatMessage(messages.clearFilter)}
                    </Button>
                  </div>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {loading && <CardLoader />}

        {filteredVehicles.length > 0 && (
          <Box width="full">
            <Stack space={2}>
              {filteredVehicles.map((item, index) => {
                return <VehicleCard vehicle={item} key={index} />
              })}
            </Stack>
          </Box>
        )}
      </Stack>
    </>
  )
}
export default VehiclesOverview
