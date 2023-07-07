import { useQuery } from '@apollo/client'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  BoxProps,
  LoadingDots,
  Pagination,
  Table,
  Text,
} from '@island.is/island-ui/core'
import {
  AircraftRegistryAircraft,
  AircraftRegistryPerson,
  ConnectedComponent,
  GetAircraftsBySearchTermQueryQuery,
  GetAircraftsBySearchTermQueryQueryVariables,
  GetAllAircraftsQuery,
  GetAllAircraftsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_AIRCRAFTS_BY_SEARCH_TERM_QUERY,
  GET_ALL_AIRCRAFTS_QUERY,
} from '@island.is/web/screens/queries/AircraftSearch'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

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
    aircraft?.owners?.length > 1 ? ` ${pluralPostfix}` : ''
  }`
}

interface AircraftSearchProps {
  slice: ConnectedComponent
}

const AircraftSearch = ({ slice }: AircraftSearchProps) => {
  const router = useRouter()
  const [searchInputHasFocus, setSearchInputHasFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const n = useNamespace(slice?.json ?? {})
  const searchValueHasBeenInitialized = useRef(false)

  const handleSearch = () => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, aq: searchValue },
    })
  }

  useEffect(() => {
    if (
      !searchValue &&
      router?.query?.aq &&
      !searchValueHasBeenInitialized.current
    ) {
      setSearchValue(router.query.aq as string)
      searchValueHasBeenInitialized.current = true
    }
  }, [router?.query?.aq, searchValue])

  const shouldDisplayAircraftDetails = router?.isReady && router?.query?.aq

  const shouldDisplaySearchInput =
    slice?.configJson?.displaySearchInput ?? false

  return (
    <Box>
      {shouldDisplaySearchInput && (
        <Box marginTop={2} marginBottom={3}>
          <AsyncSearchInput
            buttonProps={{
              onClick: handleSearch,
              onFocus: () => setSearchInputHasFocus(true),
              onBlur: () => setSearchInputHasFocus(false),
            }}
            inputProps={{
              name: 'public-vehicle-search',
              inputSize: 'large',
              placeholder: n('inputPlaceholder', 'Númer eða eigandi'),
              colored: true,
              onChange: (ev) => setSearchValue(ev.target.value),
              value: searchValue,
              onKeyDown: (ev) => {
                if (ev.key === 'Enter') {
                  handleSearch()
                }
              },
            }}
            hasFocus={searchInputHasFocus}
          />
        </Box>
      )}

      {shouldDisplayAircraftDetails && (
        <AircraftDetails slice={slice} searchTerm={searchValue} />
      )}
      {!shouldDisplayAircraftDetails && <AircraftTable slice={slice} />}
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

interface AircraftDetailsProps extends AircraftSearchProps {
  searchTerm: string
}

const AircraftDetails = ({ slice, searchTerm }: AircraftDetailsProps) => {
  const n = useNamespace(slice?.json ?? {})
  const { data, loading, error } = useQuery<
    GetAircraftsBySearchTermQueryQuery,
    GetAircraftsBySearchTermQueryQueryVariables
  >(GET_AIRCRAFTS_BY_SEARCH_TERM_QUERY, {
    variables: {
      input: {
        searchTerm,
      },
    },
  })

  const displayedResults =
    data?.aircraftRegistryAircraftsBySearchTerm?.aircrafts ?? []

  if (!loading && error) {
    return (
      <AlertMessage
        type="error"
        title={n('errorOccurredTitle', 'Villa kom upp')}
        message={n('errorOccurredMessage', 'Ekki tókst að sækja loftför')}
      />
    )
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center">
        <LoadingDots />
      </Box>
    )
  }

  if (displayedResults.length === 0) {
    return <Text>{n('noResultFound', 'Ekkert loftfar fannst')}</Text>
  }

  return (
    <Box>
      {displayedResults.map((aircraft) => {
        const displayedOwner = getDisplayedOwner(aircraft)
        const displayedOwnerName = getDisplayedOwnerName(
          aircraft,
          n('andMore', 'ofl.'),
        )
        return (
          <Box key={aircraft?.identifiers}>
            <Table.Table>
              <Table.Body>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('identifier', 'Einkennisstafir')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.identifiers}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('registrationNumber', 'Skráningarnúmer')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.registrationNumber}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">{n('type', 'Tegund')}:</Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.type}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('productionYear', 'Framleiðsluár')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.productionYear}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('serialNumber', 'Raðnúmer')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.serialNumber}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('maxWeight', 'Hámarksþungi')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <Text>{aircraft.maxWeight}</Text>
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">{n('owner', 'Eigandi')}:</Text>
                  </Table.Data>
                  <Table.Data>
                    <AircraftPerson
                      person={{ ...displayedOwner, name: displayedOwnerName }}
                    />
                  </Table.Data>
                </Table.Row>
                <Table.Row>
                  <Table.Data>
                    <Text fontWeight="semiBold">
                      {n('operator', 'Umráðandi')}:
                    </Text>
                  </Table.Data>
                  <Table.Data>
                    <AircraftPerson person={aircraft?.operator} />
                  </Table.Data>
                </Table.Row>
              </Table.Body>
            </Table.Table>
          </Box>
        )
      })}
    </Box>
  )
}

const AircraftTable = ({ slice }: AircraftSearchProps) => {
  const n = useNamespace(slice?.json ?? {})
  const [selectedPage, setSelectedPage] = useState(1)
  const pageSize = Number(slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE)
  const router = useRouter()

  const [latestAircraftListResponse, setLatestAircraftListResponse] = useState<
    typeof data.aircraftRegistryAllAircrafts
  >(null)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const { data } = useQuery<
    GetAllAircraftsQuery,
    GetAllAircraftsQueryVariables
  >(GET_ALL_AIRCRAFTS_QUERY, {
    variables: {
      input: {
        pageNumber: selectedPage,
        pageSize: pageSize,
      },
    },
    onCompleted(data) {
      setLatestAircraftListResponse(data?.aircraftRegistryAllAircrafts)
      setErrorOccurred(false)
    },
    onError() {
      setErrorOccurred(true)
    },
  })

  const totalAircrafts = latestAircraftListResponse?.totalCount ?? 0
  const displayedAircraftList = latestAircraftListResponse?.aircrafts ?? []
  const shouldDisplaySearchInput =
    slice?.configJson?.displaySearchInput ?? false

  return (
    <Box>
      {!errorOccurred && displayedAircraftList.length > 0 && (
        <Box>
          <Table.Table>
            <Table.Head>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {n('identifier', 'Einkennisstafir')}
                </Text>
              </Table.HeadData>
              <Table.HeadData>
                <Text fontWeight="semiBold">
                  {n('serialNumber', 'Raðnúmer')}
                </Text>
              </Table.HeadData>
              <Table.HeadData>
                <Text fontWeight="semiBold">{n('type', 'Tegund')}</Text>
              </Table.HeadData>
              <Table.HeadData>
                <Text fontWeight="semiBold">{n('owner', 'Eigandi')}</Text>
              </Table.HeadData>
              <Table.HeadData>
                <Text fontWeight="semiBold">{n('operator', 'Umráðandi')}</Text>
              </Table.HeadData>
            </Table.Head>
            <Table.Body>
              {displayedAircraftList.map((aircraft) => {
                const displayedOwnerName = getDisplayedOwnerName(
                  aircraft,
                  n('andMore', 'ofl.'),
                )

                const boxProps: BoxProps = shouldDisplaySearchInput
                  ? {
                      cursor: 'pointer',
                      onClick: () => {
                        if (!aircraft?.identifiers) return
                        router.replace({
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            aq: aircraft?.identifiers,
                          },
                        })
                      },
                    }
                  : {}

                return (
                  <Table.Row key={aircraft?.identifiers}>
                    <Table.Data>
                      <Box {...boxProps}>
                        <Text
                          color={
                            shouldDisplaySearchInput ? 'blue400' : undefined
                          }
                        >
                          {aircraft?.identifiers}
                        </Text>
                      </Box>
                    </Table.Data>
                    <Table.Data>
                      <Text>{aircraft?.serialNumber}</Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{aircraft?.type}</Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{displayedOwnerName}</Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{aircraft?.operator?.name}</Text>
                    </Table.Data>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Table>
        </Box>
      )}
      {errorOccurred && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja loftför')}
        />
      )}

      {totalAircrafts > 0 && (
        <Box marginTop={3}>
          <Pagination
            page={selectedPage}
            itemsPerPage={pageSize}
            totalItems={totalAircrafts}
            renderLink={(page, className, children) => (
              <button
                onClick={() => {
                  setSelectedPage(page)
                  router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, page: page },
                  })
                }}
              >
                <span className={className}>{children}</span>
              </button>
            )}
          />
        </Box>
      )}
    </Box>
  )
}

export default AircraftSearch
