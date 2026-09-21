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
  TaxiDriver,
} from '@island.is/web/graphql/schema'

import {
  getNormalizedSearchTerms,
  getSortedAndFilteredList,
} from '../../syslumenn/utils'
import { GET_TAXI_DRIVERS_WITH_OPERATING_LICENCE_QUERY } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 20
const SEARCH_KEYS: (keyof TaxiDriver)[] = [
  'name',
  'stationName',
  'stationId',
  'representativeName',
]

interface TaxiDriversWithOperatingLicenceListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const TaxiDriversWithOperatingLicenceList = ({
  slice,
}: TaxiDriversWithOperatingLicenceListProps) => {
  const { formatMessage } = useIntl()
  const [listState, setListState] = useState<ListState>('loading')
  const [drivers, setDrivers] = useState<TaxiDriver[]>([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [searchTerms, _setSearchTerms] = useState<string[]>([])

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    _setSearchTerms(getNormalizedSearchTerms(searchString))
  }

  useQuery<Query>(GET_TAXI_DRIVERS_WITH_OPERATING_LICENCE_QUERY, {
    onCompleted: (data) => {
      const fetched = data?.getTaxiDriversWithOperatingLicence?.drivers ?? []
      setDrivers(
        [...fetched].sort((a, b) => a.name.localeCompare(b.name, 'is')),
      )
      setListState('loaded')
    },
    onError: () => setListState('error'),
  })

  const filteredDrivers = getSortedAndFilteredList(
    drivers,
    searchTerms,
    SEARCH_KEYS,
  )
  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const totalPages = Math.ceil(filteredDrivers.length / pageSize)

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
            name="taxiDriverOperatingLicenceSearch"
            placeholder={formatMessage(t.searchPlaceholder)}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon={{ name: 'search', type: 'outline' }}
            onChange={(event) => onSearch(event.target.value)}
          />
        </Box>
      )}
      {listState === 'loaded' && filteredDrivers.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noDriversFound)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredDrivers.length > 0 && (
        <Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(t.name)}</T.HeadData>
                <T.HeadData>{formatMessage(t.stationName)}</T.HeadData>
                <T.HeadData>{formatMessage(t.stationId)}</T.HeadData>
                <T.HeadData>{formatMessage(t.representativeName)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {filteredDrivers
                .slice(
                  (currentPageNumber - 1) * pageSize,
                  currentPageNumber * pageSize,
                )
                .map((driver) => (
                  <T.Row key={driver.id}>
                    <T.Data>
                      <Text variant="small">{driver.name}</Text>
                    </T.Data>
                    <T.Data>
                      <Text variant="small">{driver.stationName}</Text>
                    </T.Data>
                    <T.Data>
                      <Text variant="small">{driver.stationId}</Text>
                    </T.Data>
                    <T.Data>
                      <Text variant="small">{driver.representativeName}</Text>
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

export default TaxiDriversWithOperatingLicenceList
