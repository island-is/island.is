import { useState, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import {
  ConnectedComponent,
  AircraftRegistryAircraft,
  GetAllAircraftsQuery,
  GetAllAircraftsQueryVariables,
  AircraftRegistryPerson,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Button,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLazyQuery } from '@apollo/client'
import { GET_ALL_AIRCRAFTS_QUERY } from '@island.is/web/screens/queries/AircraftSearch'

const DEFAULT_PAGE_SIZE = 10

const getDisplayedOwner = (aircraft: AircraftRegistryAircraft) => {
  return (
    aircraft?.owners?.find(
      (owner) => owner?.name === aircraft?.operator?.name,
    ) ?? aircraft?.owners?.[0]
  )
}

const getDisplayedOwnerName = (
  aircraft: AircraftRegistryAircraft,
  pluralPostfix: string,
) => {
  const displayedOwnerName = getDisplayedOwner(aircraft)?.name
  if (!displayedOwnerName) return displayedOwnerName
  return `${displayedOwnerName}${
    (aircraft?.owners?.length ?? -1) > 1 ? ` ${pluralPostfix}` : ''
  }`
}

interface AircraftSearchProps {
  slice: ConnectedComponent
}

const AircraftSearch = ({ slice }: AircraftSearchProps) => {
  const router = useRouter()
  const [searchInputHasFocus, setSearchInputHasFocus] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const namespace = slice?.json ?? {}
  const n = useNamespace(namespace)

  const handleSearch = (page = 1, searchValue?: string) => {
    let searchString = searchTerm

    if (typeof searchValue === 'string') {
      searchString = searchValue
      setSearchTerm(searchValue)
    }

    setSelectedPage(page)
    const updatedQuery = { ...router.query }
    if (!searchString) {
      delete updatedQuery['aq']
    } else {
      updatedQuery['aq'] = searchString
    }
    if (page === 1) {
      delete updatedQuery['page']
    } else {
      updatedQuery['page'] = String(page)
    }

    router.replace({
      pathname: router.pathname,
      query: updatedQuery,
    })
    search({
      variables: {
        input: {
          pageNumber: page,
          pageSize: pageSize,
          searchTerm: searchString,
        },
      },
    })
  }

  const [selectedPage, setSelectedPage] = useState(1)
  const pageSize = Number(slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE)
  const [latestAircraftListResponse, setLatestAircraftListResponse] =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    useState<typeof data.aircraftRegistryAllAircrafts>(null)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const [search, { data, loading, called }] = useLazyQuery<
    GetAllAircraftsQuery,
    GetAllAircraftsQueryVariables
  >(GET_ALL_AIRCRAFTS_QUERY, {
    onCompleted(data) {
      setLatestAircraftListResponse(data?.aircraftRegistryAllAircrafts)
      setErrorOccurred(false)
    },
    onError() {
      setErrorOccurred(true)
    },
  })

  useEffect(() => {
    if (called || !router?.isReady) return

    let searchTerm: string | undefined = undefined
    if (typeof router.query?.aq === 'string') {
      searchTerm = router.query.aq
      setSearchTerm(router.query.aq)
    }

    let pageNumber = 1
    if (typeof router?.query?.page === 'string') {
      const pageQueryParam = Number(router.query.page)
      if (!isNaN(pageQueryParam)) {
        pageNumber = pageQueryParam
        setSelectedPage(pageQueryParam)
      }
    }

    search({
      variables: {
        input: {
          pageNumber,
          pageSize: pageSize,
          searchTerm,
        },
      },
    })
  }, [
    pageSize,
    search,
    called,
    router.query.aq,
    router?.isReady,
    router.query.page,
  ])

  const totalAircrafts = latestAircraftListResponse?.totalCount ?? 0
  const displayedAircraftList = latestAircraftListResponse?.aircrafts ?? []

  const resetSearchText = n('resetSearch', 'Núllstilla leit')
  const shouldDisplayResetButton = !!router?.query?.aq

  const minHeightFromConfig = slice?.configJson?.minHeight
  const tableContainerStyles: CSSProperties = {}
  const totalPages = Math.ceil(totalAircrafts / pageSize)

  if (totalPages > 1) {
    /**
     * Allow for a minimum height of the table, so that the pagination elements stay in the same
     * location. E.g. when the last page has fewer items, then this will prevent the
     * pagination elements from moving.
     */
    tableContainerStyles.minHeight = minHeightFromConfig ?? undefined
  }

  return (
    <Box>
      <Box marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: () => handleSearch(),
            onFocus: () => setSearchInputHasFocus(true),
            onBlur: () => setSearchInputHasFocus(false),
          }}
          inputProps={{
            onFocus: () => setSearchInputHasFocus(true),
            onBlur: () => setSearchInputHasFocus(false),
            name: 'public-vehicle-search',
            inputSize: 'medium',
            placeholder: n('inputPlaceholder', 'Númer eða eigandi'),
            colored: true,
            onChange: (ev) => setSearchTerm(ev.target.value),
            value: searchTerm,
            onKeyDown: (ev) => {
              if (ev.key === 'Enter') {
                handleSearch()
              }
            },
          }}
          hasFocus={searchInputHasFocus}
          loading={loading}
        />
      </Box>

      {resetSearchText && !loading && shouldDisplayResetButton && (
        <Box marginBottom={3}>
          <Button
            variant="text"
            icon="reload"
            size="small"
            onClick={() => handleSearch(1, '')}
          >
            {resetSearchText}
          </Button>
        </Box>
      )}

      {!loading && errorOccurred && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja loftför')}
        />
      )}

      {!errorOccurred &&
        !loading &&
        displayedAircraftList.length === 1 &&
        selectedPage === 1 && (
          <AircraftDetails
            namespace={namespace}
            aircraft={displayedAircraftList[0]}
          />
        )}

      {called &&
        !loading &&
        !errorOccurred &&
        displayedAircraftList.length === 0 && (
          <Text>{n('noResultFound', 'Ekkert loftfar fannst')}</Text>
        )}

      {!errorOccurred &&
        (displayedAircraftList.length > 1 || selectedPage !== 1) && (
          <Box>
            <Box style={tableContainerStyles}>
              <AircraftTable
                namespace={namespace}
                aircrafts={displayedAircraftList}
                onAircraftClick={(identifier) => handleSearch(1, identifier)}
              />
            </Box>
            {totalPages > 1 && (
              <Box marginTop={3}>
                <Pagination
                  variant="blue"
                  page={selectedPage}
                  itemsPerPage={pageSize}
                  totalItems={totalAircrafts}
                  renderLink={(page, className, children) => (
                    <button onClick={() => handleSearch(page)}>
                      <span className={className}>{children}</span>
                    </button>
                  )}
                />
              </Box>
            )}
          </Box>
        )}
    </Box>
  )
}

interface AircraftPersonProps {
  person?: AircraftRegistryPerson
}

const AircraftPerson = ({ person }: AircraftPersonProps) => {
  return (
    <Box>
      <Text>{person?.name}</Text>
      <Text>{person?.address}</Text>
      <Text>
        {person?.postcode} {person?.city}
      </Text>
      <Text>{person?.country}</Text>
    </Box>
  )
}

interface AircraftDetailsProps {
  namespace: Record<string, string>
  aircraft: AircraftRegistryAircraft
}

const AircraftDetails = ({ namespace, aircraft }: AircraftDetailsProps) => {
  const n = useNamespace(namespace)

  const displayedOwner = getDisplayedOwner(aircraft)
  const displayedOwnerName = getDisplayedOwnerName(
    aircraft,
    n('andMore', 'ofl.'),
  )

  return (
    <Box>
      <Box>
        <T.Table>
          <T.Body>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">
                  {n('identifier', 'Einkennisstafir')}:
                </Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.identifiers}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">
                  {n('registrationNumber', 'Skráningarnúmer')}:
                </Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.registrationNumber}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">{n('type', 'Tegund')}:</Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.type}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">
                  {n('productionYear', 'Framleiðsluár')}:
                </Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.productionYear}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">
                  {n('serialNumber', 'Raðnúmer')}:
                </Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.serialNumber}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">
                  {n('maxWeight', 'Hámarksþungi')}:
                </Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft.maxWeight}</Text>
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">{n('owner', 'Eigandi')}:</Text>
              </T.Data>
              <T.Data>
                <AircraftPerson
                  person={{ ...displayedOwner, name: displayedOwnerName }}
                />
              </T.Data>
            </T.Row>
            <T.Row>
              <T.Data>
                <Text fontWeight="semiBold">{n('operator', 'Umráðandi')}:</Text>
              </T.Data>
              <T.Data>
                <AircraftPerson
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  person={aircraft?.operator}
                />
              </T.Data>
            </T.Row>
          </T.Body>
        </T.Table>
      </Box>
    </Box>
  )
}

interface AircraftTableProps {
  namespace: Record<string, string>
  aircrafts: AircraftRegistryAircraft[]
  onAircraftClick: (identifier: string) => void
}
const AircraftTable = ({
  aircrafts,
  namespace,
  onAircraftClick,
}: AircraftTableProps) => {
  const n = useNamespace(namespace)

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>
            <Text fontWeight="semiBold">
              {n('identifier', 'Einkennisstafir')}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text fontWeight="semiBold">
              {n('registrationNumber', 'Skráningarnúmer')}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text fontWeight="semiBold">{n('serialNumber', 'Raðnúmer')}</Text>
          </T.HeadData>
          <T.HeadData>
            <Text fontWeight="semiBold">{n('type', 'Tegund')}</Text>
          </T.HeadData>
          <T.HeadData>
            <Text fontWeight="semiBold">{n('owner', 'Eigandi')}</Text>
          </T.HeadData>
          <T.HeadData>
            <Text fontWeight="semiBold">{n('operator', 'Umráðandi')}</Text>
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {aircrafts.map((aircraft) => {
          const displayedOwnerName = getDisplayedOwnerName(
            aircraft,
            n('andMore', 'ofl.'),
          )
          return (
            <T.Row key={aircraft?.identifiers}>
              <T.Data>
                <Box
                  cursor="pointer"
                  onClick={() => {
                    if (!aircraft?.identifiers) return
                    onAircraftClick(aircraft.identifiers)
                  }}
                >
                  <Text color="blue400">{aircraft?.identifiers}</Text>
                </Box>
              </T.Data>
              <T.Data>
                <Text>{aircraft?.registrationNumber}</Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft?.serialNumber}</Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft?.type}</Text>
              </T.Data>
              <T.Data>
                <Text>{displayedOwnerName}</Text>
              </T.Data>
              <T.Data>
                <Text>{aircraft?.operator?.name}</Text>
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}

export default AircraftSearch
