import { useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  DropdownMenu,
  Filter,
  Input,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formSubmit,
  IntroWrapper,
  LinkButton,
  m,
  SAMGONGUSTOFA_SLUG,
} from '@island.is/portals/my-pages/core'

import { VehicleCard } from '../../components/VehicleCard'
import {
  vehicleMessage as messages,
  urls,
  vehicleMessage,
} from '../../lib/messages'

import { useGetUsersVehiclesV2LazyQuery } from './Overview.generated'
import useDebounce from 'react-use/lib/useDebounce'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'

const defaultFilterValues = {
  searchQuery: '',
  onlyMileageRequiredVehicles: undefined,
}
type FilterValues = {
  searchQuery: string
  onlyMileageRequiredVehicles?: boolean
}

const VehiclesOverview = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [page, setPage] = useState(1)
  const [searchLoading, setSearchLoading] = useState(false)

  const [filterValue, setFilterValue] =
    useState<FilterValues>(defaultFilterValues)

  const [GetUsersVehiclesLazyQuery, { loading, error, ...usersVehicleQuery }] =
    useGetUsersVehiclesV2LazyQuery()

  useEffect(() => {
    GetUsersVehiclesLazyQuery({
      variables: {
        input: {
          pageSize: 10,
          page: 1,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useDebounce(
    () => {
      const onlyMileage = Boolean(filterValue.onlyMileageRequiredVehicles)
      const permno = filterValue.searchQuery
      GetUsersVehiclesLazyQuery({
        onCompleted: () => setSearchLoading(false),
        variables: {
          input: {
            pageSize: 10,
            page: page,
            ...(permno && { permno }),
            ...(onlyMileage && { onlyMileage }),
          },
        },
      })
    },
    500,
    [filterValue.onlyMileageRequiredVehicles, filterValue.searchQuery, page],
  )

  const vehicles = usersVehicleQuery.data?.vehiclesListV2

  const ownershipLinks =
    usersVehicleQuery.data?.vehiclesListV2?.downloadServiceUrls
  const filteredVehicles = vehicles?.vehicleList ?? []

  return (
    <IntroWrapper
      title={messages.title}
      intro={messages.intro}
      serviceProviderSlug={SAMGONGUSTOFA_SLUG}
      serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      buttonGroup={
        (!loading && !error && filteredVehicles.length > 0) || searchLoading
          ? [
              ownershipLinks ? (
                <DropdownMenu
                  key="dropdown-menu"
                  icon="ellipsisHorizontal"
                  menuLabel={formatMessage(messages.myCarsFiles)}
                  items={[
                    {
                      onClick: () => formSubmit(ownershipLinks.pdf),
                      title: formatMessage(messages.myCarsFilesPDF),
                    },
                    {
                      onClick: () => formSubmit(ownershipLinks.excel),
                      title: formatMessage(messages.myCarsFilesExcel),
                    },
                  ]}
                  title={formatMessage(messages.myCarsFiles)}
                />
              ) : undefined,
              <LinkButton
                key="owner-change"
                to={formatMessage(urls.ownerChange)}
                text={formatMessage(messages.changeOfOwnership)}
                icon="open"
                variant="utility"
              />,
              <LinkButton
                key="recycle-car"
                to={formatMessage(urls.recycleCar)}
                text={formatMessage(messages.recycleCar)}
                icon="reader"
                variant="utility"
              />,
              <LinkButton
                key="hide-name"
                to={formatMessage(urls.hideName)}
                text={formatMessage(messages.vehicleNameSecret)}
                icon="eyeOff"
                variant="utility"
              />,
            ].filter(isDefined)
          : []
      }
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      <Stack space={2}>
        {((!loading && !error) || searchLoading) && (
          <Box marginBottom={1}>
            <Filter
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              variant="popover"
              onFilterClear={() => {
                setFilterValue(defaultFilterValues)
                setPage(1)
              }}
              align="left"
              reverse
              filterInput={
                <Input
                  icon={{ name: 'search' }}
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => {
                    if (ev.target.value !== filterValue.searchQuery) {
                      setPage(1)
                      setSearchLoading(true)
                    }
                    setFilterValue({
                      ...filterValue,
                      searchQuery: ev.target.value,
                    })
                  }}
                  name="okutaeki-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(vehicleMessage.searchForPlate)}
                />
              }
            >
              <Box padding={4}>
                <Text variant="eyebrow" as="p" paddingBottom={2}>
                  {formatMessage(m.filterBy)}
                </Text>
                <Checkbox
                  name="onlyMileageRequiredVehicles"
                  label={formatMessage(
                    vehicleMessage.vehiclesRequireMileageRegistration,
                  )}
                  value="onlyMileageRequiredVehicles"
                  checked={Boolean(filterValue.onlyMileageRequiredVehicles)}
                  onChange={(e) => {
                    setPage(1)
                    setSearchLoading(true)
                    setFilterValue({
                      ...filterValue,
                      onlyMileageRequiredVehicles: e.target.checked,
                    })
                  }}
                />
              </Box>
            </Filter>
          </Box>
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
                  onClick={() => {
                    setSearchLoading(true)
                    setPage(page)
                  }}
                >
                  {children}
                </button>
              )}
            />
          </Box>
        )}
        {!loading && !error && vehicles?.vehicleList?.length === 0 && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noDataFoundVariable, {
              arg: formatMessage(messages.title).toLowerCase(),
            })}
            message={formatMessage(m.noDataFoundVariableDetailVariation, {
              arg: formatMessage(messages.title).toLowerCase(),
            })}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
      </Stack>
    </IntroWrapper>
  )
}
export default VehiclesOverview
