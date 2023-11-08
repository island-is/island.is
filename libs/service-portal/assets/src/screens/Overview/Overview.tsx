import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useState } from 'react'

import { VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  EmptyState,
  ErrorScreen,
  FootNote,
  formSubmit,
  IntroHeader,
  m,
  SAMGONGUSTOFA_ID,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { VehicleCard } from '../../components/VehicleCard'
import { vehicleMessage as messages, urls } from '../../lib/messages'
import DropdownExport from '../../components/DropdownExport/DropdownExport'

import { useGetUsersVehiclesLazyQuery } from './Overview.generated'
import {
  useGetExcelVehiclesLazyQuery,
  useGetExcelVehiclesQuery,
} from '../../utils/VehicleExcel.generated'
import { exportVehicleOwnedDocument } from '../../utils/vehicleOwnedMapper'
import { debounce } from 'lodash'
import useDebounce from 'react-use/lib/useDebounce'

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
  if (!vehicles) {
    return []
  }
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

  const [searchPage, setSearchPage] = useState(1)
  const [downloadExcel, setDownloadExcel] = useState(false)
  const [vehicleData, setVehicleData] = useState<any>(null)

  const [filterValue, setFilterValue] =
    useState<FilterValues>(defaultFilterValues)

  const [isSearching, setIsSearching] = useState(false)
  const [
    GetUsersVehiclesLazyQuery,
    { loading, error, fetchMore, ...usersVehicleQuery },
  ] = useGetUsersVehiclesLazyQuery({
    variables: {
      input: {
        pageSize: 10,
        page: page,
        showDeregeristered: false,
        showHistory: false,
      },
    },
  })

  const [
    GetUsersSearchVehiclesLazyQuery,
    {
      loading: searchLoading,
      error: searchError,
      fetchMore: searchFetchMore,
      ...usersSearchVehicleQuery
    },
  ] = useGetUsersVehiclesLazyQuery({
    variables: {
      input: {
        pageSize: 10,
        page: searchPage,
        showDeregeristered: false,
        showHistory: false,
        permno: filterValue.searchQuery,
      },
    },
  })
  const [
    GetExcelVehiclesLazyQuery,
    { loading: excelLoading, error: excelError, ...usersExcelVehicleQuery },
  ] = useGetExcelVehiclesLazyQuery()

  useEffect(() => {
    GetUsersVehiclesLazyQuery()
  }, [page])

  useDebounce(
    () => {
      if (isSearching) {
        GetUsersSearchVehiclesLazyQuery()
      }
    },
    500,
    [isSearching],
  )

  useEffect(() => {
    if (downloadExcel) {
      GetExcelVehiclesLazyQuery().then((data) =>
        setVehicleData(data.data?.getExcelVehicles?.vehicles),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadExcel])

  useEffect(() => {
    if (downloadExcel && vehicleData) {
      exportVehicleOwnedDocument(
        usersExcelVehicleQuery.data?.getExcelVehicles?.vehicles,
        formatMessage(messages.myCarsFiles),
        userInfo.profile.name,
        userInfo.profile.nationalId,
      )
      setDownloadExcel(false)
    }
  }, [vehicleData])
  const vehicles = isSearching
    ? usersSearchVehicleQuery.data?.vehiclesList
    : usersVehicleQuery.data?.vehiclesList

  // eslint-disable-next-line react-hooks/exhaustive-deps

  //const vehicles = usersVehicleQuery.data?.vehiclesList?.vehicleList || []
  const ownershipPdf = usersVehicleQuery.data?.vehiclesList?.downloadServiceURL
  const filteredVehicles = vehicles?.vehicleList ?? []

  const handleSearchChange = useCallback((value: string) => {
    setFilterValue({ ...defaultFilterValues, searchQuery: value })
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
      <IntroHeader
        title={messages.title}
        intro={messages.intro}
        serviceProviderID={SAMGONGUSTOFA_ID}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      />

      {((!loading && !error && filteredVehicles.length > 0) || isSearching) && (
        <Box marginBottom={3} display="flex" flexWrap="wrap">
          {!loading && ownershipPdf && (
            <Box marginRight={2} marginBottom={[1]}>
              <DropdownExport
                onGetPDF={() => formSubmit(`${ownershipPdf}`)}
                onGetExcel={() => setDownloadExcel(true)}
              />
            </Box>
          )}
          <Box paddingRight={2} marginBottom={[1]}>
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
          <Box marginRight={2} marginBottom={[1]}>
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
          <Box marginBottom={[1]}>
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
        {!loading && !error && (
          <GridRow>
            <GridColumn span={['9/9', '9/9', '5/9', '4/9', '3/9']}>
              <Box marginBottom={1}>
                <Input
                  icon={{ name: 'search' }}
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => {
                    if (!isSearching) {
                      setPage(1)
                      setIsSearching(true)
                    } else {
                      if (ev.target.value === '') {
                        setIsSearching(false)
                        setPage(1)
                      }
                    }
                    handleSearchChange(ev.target.value)
                  }}
                  name="okutaeki-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchPlaceholder)}
                />
              </Box>
            </GridColumn>
          </GridRow>
        )}

        {(loading || searchLoading) && <CardLoader />}

        {filteredVehicles.length > 0 && !searchLoading && (
          <Box width="full">
            <Stack space={2}>
              {filteredVehicles.map((item, index) => {
                return <VehicleCard vehicle={item} key={index} />
              })}
            </Stack>
          </Box>
        )}
        {!loading && !searchLoading && filteredVehicles.length > 0 && (
          <Box>
            <Pagination
              page={vehicles?.paging?.pageNumber ?? 0}
              totalPages={vehicles?.paging?.totalPages ?? 0}
              renderLink={(page, className, children) => (
                <button className={className} onClick={() => setPage(page)}>
                  {children}
                </button>
              )}
            />
          </Box>
        )}
        {!loading && !error && vehicles?.vehicleList?.length === 0 && (
          <Box marginTop={[0, 8]}>
            <EmptyState />
          </Box>
        )}
      </Stack>

      <FootNote serviceProviderID={SAMGONGUSTOFA_ID} />
    </>
  )
}
export default VehiclesOverview
