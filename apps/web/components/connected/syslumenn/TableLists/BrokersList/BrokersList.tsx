import { CSSProperties, FC, useState } from 'react'
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
import { sortAlpha } from '@island.is/shared/utils'
import { ConnectedComponent, Query } from '@island.is/web/graphql/schema'

import { GET_BROKERS_QUERY } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 5
const DEFAULT_TABLE_MIN_HEIGHT = '800px'

type Broker = Query['getBrokers'][number]

interface BrokersListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const getSortedAndFilteredBrokers = (
  brokers: Query['getBrokers'],
  searchTerms: string[],
): Query['getBrokers'] => {
  const fullSearchString: string = searchTerms.join(' ')
  const brokersStartingWithFullSearchString: Query['getBrokers'] = []
  const brokersContainingAllTerm: Query['getBrokers'] = []

  const startsWithFullSearchString = (broker: Broker): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    return (
      broker.name?.trim().toLowerCase().startsWith(fullSearchString) ||
      broker.nationalId?.trim().toLowerCase().startsWith(fullSearchString)
    )
  }

  const containsAllTerms = (broker: Broker): boolean => {
    return searchTerms.every(
      (searchTerm) =>
        broker.name?.trim().toLowerCase().includes(searchTerm) ||
        broker.nationalId?.trim().toLowerCase().includes(searchTerm),
    )
  }

  // Categorize the brokers into two arrays based on the matching criteria
  for (const broker of brokers) {
    if (startsWithFullSearchString(broker)) {
      brokersStartingWithFullSearchString.push(broker)
    } else if (containsAllTerms(broker)) {
      brokersContainingAllTerm.push(broker)
    }
  }

  // Concatenate the arrays with, starting with the brokers that start with the full search string.
  return brokersStartingWithFullSearchString.concat(brokersContainingAllTerm)
}

const BrokersList: FC<React.PropsWithChildren<BrokersListProps>> = ({
  slice,
}) => {
  const { formatMessage } = useIntl()

  const [listState, setListState] = useState<ListState>('loading')
  const [brokers, setBrokers] = useState<Query['getBrokers']>([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(
      searchString
        // In some operating systems, when the user is typing a diacritic letter (e.g. á, é, í) that requires two key presses,
        // the diacritic mark is added to the search string on the first key press and is then replaced with the diacritic letter
        // on the second key press. For the intermediate state, we remove the diacritic mark so that it does
        // not affect the search results.
        .replace('´', '')

        // Normalize the search string
        .trim()
        .toLowerCase()

        // Split the search string into terms.
        .split(' '),
    )

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    setSearchString(searchString)
  }

  useQuery<Query>(GET_BROKERS_QUERY, {
    onCompleted: (data) => {
      const fetchedBrokers = [...(data?.getBrokers ?? [])]
      setBrokers(fetchedBrokers.sort(sortAlpha('name')))
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const filteredBrokers = getSortedAndFilteredBrokers(brokers, searchTerms)

  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const totalPages = Math.ceil(filteredBrokers.length / pageSize)

  const minHeightFromConfig = slice?.configJson?.minHeight
  const tableContainerStyles: CSSProperties = {}
  if (totalPages > 1) {
    /**
     * Force a minimum height of the table, so that the pagination elements stay in the same
     * location. E.g. when the last page has fewer items, then this will prevent the
     * pagination elements from moving.
     */
    tableContainerStyles.minHeight =
      minHeightFromConfig ?? DEFAULT_TABLE_MIN_HEIGHT
  }

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
            name="brokersSearchInput"
            placeholder={formatMessage(t.searchPlaceholder)}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon={{
              name: 'search',
              type: 'outline',
            }}
            onChange={(event) => onSearch(event.target.value)}
          />
        </Box>
      )}
      {listState === 'loaded' && filteredBrokers.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noBrokersFound)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredBrokers.length > 0 && (
        <Box>
          <Box style={tableContainerStyles}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{formatMessage(t.name)}</T.HeadData>
                  <T.HeadData>{formatMessage(t.nationalId)}</T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredBrokers
                  .slice(
                    (currentPageNumber - 1) * pageSize,
                    currentPageNumber * pageSize,
                  )
                  .map((broker, index) => {
                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <Text variant="small">{broker.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Box>
                            <Text variant="small">{broker.nationalId}</Text>
                          </Box>
                        </T.Data>
                      </T.Row>
                    )
                  })}
              </T.Body>
            </T.Table>
          </Box>
          {totalPages > 1 && (
            <Box marginTop={3}>
              <Pagination
                page={currentPageNumber}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setCurrentPageNumber(page)
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

export default BrokersList
