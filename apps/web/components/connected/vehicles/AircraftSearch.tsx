import { useState, useRef, useEffect } from 'react'
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
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
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
  const [searchTerm, setSearchTerm] = useState('')
  const namespace = slice?.json ?? {}
  const n = useNamespace(namespace)
  const searchValueHasBeenInitialized = useRef(false)

  const handleSearch = () => {
    setSelectedPage(1)
    setSearchTerm(searchValue)
    const updatedQuery = { ...router.query }
    if (!searchValue) {
      delete updatedQuery['aq']
    } else {
      updatedQuery['aq'] = searchValue
    }
    delete updatedQuery['page']
    router.replace({
      pathname: router.pathname,
      query: updatedQuery,
    })
  }

  useEffect(() => {
    if (
      !searchValue &&
      router?.query?.aq &&
      !searchValueHasBeenInitialized.current
    ) {
      setSearchValue(router.query.aq as string)
      setSearchTerm(router.query.aq as string)
      searchValueHasBeenInitialized.current = true
    }
  }, [router?.query?.aq, searchValue])

  const [selectedPage, setSelectedPage] = useState(1)
  const pageSize = Number(slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE)
  const [latestAircraftListResponse, setLatestAircraftListResponse] = useState<
    typeof data.aircraftRegistryAllAircrafts
  >(null)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const { data, loading } = useQuery<
    GetAllAircraftsQuery,
    GetAllAircraftsQueryVariables
  >(GET_ALL_AIRCRAFTS_QUERY, {
    variables: {
      input: {
        pageNumber: selectedPage,
        pageSize: pageSize,
        searchTerm: searchTerm,
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

  return (
    <Box>
      <Box marginTop={2} marginBottom={3}>
        <AsyncSearchInput
          buttonProps={{
            onClick: handleSearch,
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
            onChange: (ev) => setSearchValue(ev.target.value),
            value: searchValue,
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

      {!loading && errorOccurred && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja loftför')}
        />
      )}

      {!errorOccurred && displayedAircraftList.length === 1 && (
        <AircraftDetails
          namespace={namespace}
          aircraft={displayedAircraftList[0]}
        />
      )}

      {!loading && !errorOccurred && displayedAircraftList.length === 0 && (
        <Text>{n('noResultFound', 'Ekkert loftfar fannst')}</Text>
      )}

      {!errorOccurred && displayedAircraftList.length > 1 && (
        <Box>
          <AircraftTable
            namespace={namespace}
            aircrafts={displayedAircraftList}
            onAircraftClick={(identifier) => {
              setSearchValue(identifier)
              setSearchTerm(identifier)
            }}
          />
          {Math.ceil(totalAircrafts / pageSize) > 1 && (
            <Box marginTop={3}>
              <Pagination
                variant="blue"
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
                <AircraftPerson person={aircraft?.operator} />
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
