import { FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_LAWYERS_QUERY } from './queries'
import { ConnectedComponent, Query } from '@island.is/api/schema'
import { useLocalization, sortAlpha } from '../../utils'
import {
  Box,
  LoadingDots,
  Pagination,
  Table as T,
  Text,
  Input,
  AlertMessage,
} from '@island.is/island-ui/core'

import * as styles from './LawyersList.css'

const PAGE_SIZE = 5

interface LawyersListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const LawyersList: FC<LawyersListProps> = ({ slice }) => {
  const t = useLocalization(slice.json)

  const [listState, setListState] = useState<ListState>('loading')
  const [lawyers, setLawyers] = useState<Query['getLawyers']>([])
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

  useQuery<Query>(GET_LAWYERS_QUERY, {
    onCompleted: (data) => {
      const fetchedLawyers = [...(data?.getLawyers ?? [])]
      setLawyers(fetchedLawyers.sort(sortAlpha('name')))
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const filteredLawyers = lawyers.filter((lawyer) => {
    return searchTerms.every(
      (searchTerm) =>
        lawyer.name?.trim().toLowerCase().includes(searchTerm) ||
        lawyer.licenceType?.trim().toLowerCase().includes(searchTerm),
    )
  })

  const totalPages = Math.ceil(filteredLawyers.length / PAGE_SIZE)
  const forceTableMinimumHeight = totalPages > 1

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
          title={t('errorTitle', 'Villa')}
          message={t('errorMessage', 'Ekki tókst að sækja lista yfir lögmenn.')}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={4}>
          <Input
            name="lawyersSearchInput"
            placeholder={t('searchPlaceholder', 'Leita')}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon="search"
            iconType="outline"
            onChange={(event) => onSearch(event.target.value)}
          />
        </Box>
      )}
      {listState === 'loaded' && filteredLawyers.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">
            {t('noLawyersFound', 'Engir lögmenn fundust.')}
          </Text>
        </Box>
      )}
      {listState === 'loaded' && filteredLawyers.length > 0 && (
        <Box>
          <Box className={forceTableMinimumHeight && styles.tableMinimumHeight}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{t('name', 'Nafn')}</T.HeadData>
                  <T.HeadData>{t('licenceType', 'Tegund réttinda')}</T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredLawyers
                  .slice(
                    (currentPageNumber - 1) * PAGE_SIZE,
                    currentPageNumber * PAGE_SIZE,
                  )
                  .map((lawyer, index) => {
                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <Text variant="small">{lawyer.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Box
                            className={
                              !lawyer.licenceType && styles.lawyerNoLicenceType
                            }
                          >
                            <Text variant="small">
                              {lawyer.licenceType ||
                                t(
                                  'lawyerNoLicenceType',
                                  'Engin réttindi tilgreind.',
                                )}
                            </Text>
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

export { LawyersList }
