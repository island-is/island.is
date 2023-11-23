import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Pagination,
  Stack,
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
  SAMGONGUSTOFA_SLUG,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import { VehicleCard } from '../../components/VehicleCard'
import {
  vehicleMessage as messages,
  urls,
  vehicleMessage,
} from '../../lib/messages'
import DropdownExport from '../../components/DropdownExport/DropdownExport'

import { useGetUsersVehiclesLazyQuery } from './Overview.generated'
import { useGetExcelVehiclesLazyQuery } from '../../utils/VehicleExcel.generated'
import { exportVehicleOwnedDocument } from '../../utils/vehicleOwnedMapper'
import useDebounce from 'react-use/lib/useDebounce'
import { VehiclesDetail } from '@island.is/api/schema'

const defaultFilterValues = {
  searchQuery: '',
}
type FilterValues = {
  searchQuery: string
}

const VehiclesOverview = () => {
  useNamespaces('sp.vehicles')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)

  const [searchPage, setSearchPage] = useState(1)
  const [downloadExcel, setDownloadExcel] = useState(false)
  const [vehicleData, setVehicleData] = useState<
    Array<VehiclesDetail> | undefined | null
  >(null)

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
        usersExcelVehicleQuery.data?.getExcelVehicles?.vehicles ?? [],
        formatMessage(messages.myCarsFiles),
        userInfo.profile.name,
        userInfo.profile.nationalId,
      )
      setDownloadExcel(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleData])
  const vehicles = isSearching
    ? usersSearchVehicleQuery.data?.vehiclesList
    : usersVehicleQuery.data?.vehiclesList

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
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
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
                as="span"
                unfocusable
                colorScheme="default"
                icon="open"
                iconType="outline"
                size="default"
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
                as="span"
                unfocusable
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
                as="span"
                unfocusable
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
                  placeholder={formatMessage(vehicleMessage.searchForPlate)}
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
                <button
                  className={className}
                  onClick={() =>
                    isSearching ? setSearchPage(page) : setPage(page)
                  }
                >
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

      <FootNote serviceProviderSlug={SAMGONGUSTOFA_SLUG} />
    </>
  )
}
export default VehiclesOverview
