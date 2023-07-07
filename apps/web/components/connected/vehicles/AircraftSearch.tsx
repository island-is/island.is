import { useLazyQuery, useQuery } from '@apollo/client'
import {
  AlertMessage,
  AsyncSearchInput,
  Box,
  Pagination,
  Table,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  GetAllAircraftsQuery,
  GetAllAircraftsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_ALL_AIRCRAFTS_QUERY } from '@island.is/web/screens/queries/AircraftSearch'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_PAGE_SIZE = 10

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

      {shouldDisplayAircraftDetails && <AircraftDetails slice={slice} />}
      {!shouldDisplayAircraftDetails && <AircraftTable slice={slice} />}
    </Box>
  )
}

const AircraftDetails = ({ slice }: AircraftSearchProps) => {
  return <div>Hello world</div>
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
                const displayedOwnerName =
                  aircraft?.owners?.find(
                    (owner) => owner?.name === aircraft?.operator?.name,
                  )?.name ?? aircraft?.owners?.[0]?.name

                return (
                  <Table.Row key={aircraft?.identifiers}>
                    <Table.Data>
                      <Box
                        cursor="pointer"
                        onClick={() => {
                          if (!aircraft?.identifiers) return
                          router.replace({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              aq: aircraft?.identifiers,
                            },
                          })
                        }}
                      >
                        <Text color="blue600">{aircraft?.identifiers}</Text>
                      </Box>
                    </Table.Data>
                    <Table.Data>
                      <Text>{aircraft?.serialNumber}</Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>{aircraft?.type}</Text>
                    </Table.Data>
                    <Table.Data>
                      <Text>
                        {displayedOwnerName}
                        {aircraft?.owners?.length > 1
                          ? ` ${n('andMore', 'ofl.')}`
                          : ''}
                      </Text>
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
    </Box>
  )
}

export default AircraftSearch
