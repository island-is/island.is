import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client/react'

import {
  AlertMessage,
  Box,
  Input,
  LoadingDots,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import {
  ConnectedComponent,
  Query,
  TaxiStation,
} from '@island.is/web/graphql/schema'

import {
  getNormalizedSearchTerms,
  getSortedAndFilteredList,
} from '../../syslumenn/utils'
import { GET_TAXI_STATIONS_QUERY } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 20
const SEARCH_KEYS: (keyof TaxiStation)[] = ['name', 'driverCount']

interface TaxiStationListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const TaxiStationList = ({ slice }: TaxiStationListProps) => {
  const { formatMessage } = useIntl()
  const [listState, setListState] = useState<ListState>('loading')
  const [stations, setStations] = useState<
    Query['getTaxiStations']['stations']
  >([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [searchTerms, _setSearchTerms] = useState([] as string[])

  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    setSearchString(searchString)
  }

  useQuery<Query>(GET_TAXI_STATIONS_QUERY, {
    onCompleted: (data) => {
      const fetched = [...(data?.getTaxiStations?.stations ?? [])]
      fetched.sort((a, b) => a.name.localeCompare(b.name, 'is'))
      setStations(fetched)
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const filteredStations = getSortedAndFilteredList(
    stations,
    searchTerms,
    SEARCH_KEYS,
  )

  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const totalPages = Math.ceil(filteredStations.length / pageSize)

  return (
    <Box>
      {listState === 'loading' && (
        <Box
          display="flex"
          marginTop={4}
          marginBottom={20}
          justifyContent="center"
        >
          <LoadingDots />
        </Box>
      )}
      {listState === 'error' && (
        <AlertMessage
          title={formatMessage(t.errorTitle)}
          message={formatMessage(t.errorMessage)}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={4}>
          <Input
            name="taxiStationSearch"
            placeholder={formatMessage(t.searchPlaceholder)}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon={{ name: 'search', type: 'outline' }}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Box>
      )}
      {listState === 'loaded' && filteredStations.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noStationsFound)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredStations.length > 0 && (
        <Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(t.name)}</T.HeadData>
                <T.HeadData>{formatMessage(t.driverCount)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {filteredStations
                .slice(
                  (currentPageNumber - 1) * pageSize,
                  currentPageNumber * pageSize,
                )
                .map((station) => (
                  <T.Row key={station.id}>
                    <T.Data>
                      <Text variant="small">{station.name}</Text>
                    </T.Data>
                    <T.Data>
                      <Text variant="small">{station.driverCount}</Text>
                    </T.Data>
                  </T.Row>
                ))}
            </T.Body>
          </T.Table>
          {totalPages > 1 && (
            <Box marginTop={3}>
              <Pagination
                page={currentPageNumber}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button onClick={() => setCurrentPageNumber(page)}>
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

export default TaxiStationList
