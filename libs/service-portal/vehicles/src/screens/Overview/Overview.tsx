import React, { useCallback, useState } from 'react'
import {
  ServicePortalModuleComponent,
  m,
  CardLoader,
  EmptyState,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useQuery, gql } from '@apollo/client'
import { Query, Vehicle } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  Input,
  Button,
} from '@island.is/island-ui/core'
import isEqual from 'lodash/isEqual'
import { VehicleCard } from '../../components/VehicleCard'

const GET_USERS_VEHICLES = gql`
  query GetUsersVehicles {
    getVehiclesForUser {
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
      }
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
  vehicles: Vehicle[],
  filterValues: FilterValues,
): Vehicle[] => {
  const { searchQuery } = filterValues

  if (searchQuery) {
    return vehicles.filter(
      (x: Vehicle) =>
        x.permno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.regno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.type?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }
  return vehicles
}

export const VehiclesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )
  const { data, loading, error, called } = useQuery<Query>(GET_USERS_VEHICLES)
  const vehicles = data?.getVehiclesForUser?.vehicleList || []
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
      ? defineMessage({
          id: 'sp.vehicles:found-singular',
          defaultMessage: 'skjal fannst',
        })
      : defineMessage({
          id: 'sp.vehicles:found',
          defaultMessage: 'skjöl fundust',
        })
  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-title',
                  defaultMessage: 'Ökutæki',
                })}
              </Text>
              <Text as="p" variant="default">
                {formatMessage({
                  id: 'sp.vehicles:vehicles-intro',
                  defaultMessage: `Hér færðu upplýsingar úr ökutækjaskrá um ökutæki sem þú ert skráð/ur eigandi að.`,
                })}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {!loading && vehicles.length === 0 && (
        <Box marginTop={8}>
          <EmptyState title={m.noDataFound} />
        </Box>
      )}
      <Stack space={2}>
        {called && !loading && !error && vehicles.length <= 0 && (
          <AlertMessage type="info" title={formatMessage(m.noDataPresent)} />
        )}
        {!loading && !error && vehicles.length > 4 && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
              <Stack space={2}>
                <Input
                  icon="search"
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => handleSearchChange(ev.target.value)}
                  name="rafraen-skjol-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchPlaceholder)}
                />
              </Stack>
            </GridColumn>
          </GridRow>
        )}
        {hasActiveFilters() && (
          <GridRow>
            <GridColumn span={['12/12', '12/12']}>
              <Box marginTop={4}>
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
                      {formatMessage({
                        id: 'sp.vehicles:clear-filters',
                        defaultMessage: 'Hreinsa filter',
                      })}
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
