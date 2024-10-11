import { CSSProperties, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQueryState } from 'next-usequerystate'
import { useQuery } from '@apollo/client/react'

import {
  AlertMessage,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  LoadingDots,
  Pagination,
  Select,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import { SyslumennListCsvExport } from '@island.is/web/components'
import type { ConnectedComponent, Query } from '@island.is/web/graphql/schema'

import {
  getNormalizedSearchTerms,
  getSortedAndFilteredList,
  prepareCsvString,
} from '../../utils'
import { GET_PROFESSION_RIGHTS_QUERY } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_TABLE_MIN_HEIGHT = '800px'
const SEARCH_KEYS = ['name', 'nationalId']

interface ProfessionRightsProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const ProfessionRights = ({ slice }: ProfessionRightsProps) => {
  const { formatMessage } = useIntl()
  const [listState, setListState] = useState<ListState>('loading')
  const [list, setList] = useState<Query['getProfessionRights']['list']>([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))
  const [availableProfessionOptions, setProfessionOptions] = useState<
    { label: string; value: string }[]
  >([])

  const [filterProfession, setFilterProfession] = useState<
    | {
        label: string
        value: string
      }
    | undefined
    | null
  >(null)

  const [filterValue, setFilterValue] = useQueryState('profession')

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    setSearchString(searchString)
  }

  useQuery<Query>(GET_PROFESSION_RIGHTS_QUERY, {
    onCompleted: (data) => {
      const fetchedList = [...(data?.getProfessionRights?.list ?? [])]
      setList(fetchedList.sort(sortAlpha('name')))
      setListState('loaded')
      const options = [
        allProfessionOption,
        ...Array.from(
          new Set<string>(
            fetchedList
              .filter((x) => x.profession)
              .map((x) => x.profession as string),
          ).values(),
        ),
      ]
        .map((x) => ({
          label: x,
          value: x,
        }))
        .sort(sortAlpha('label'))
      setProfessionOptions(options)
      setFilterProfession(
        options.find((x) => {
          return filterValue === x.value
        }) ?? options?.[0],
      )

      setFilterValue(filterValue)
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (list) {
        const headerRow = [
          formatMessage(t.csvHeaderName),
          formatMessage(t.csvHeaderProfession),
          formatMessage(t.csvHeaderNationalId),
        ]
        const dataRows = []
        for (const item of list) {
          dataRows.push([
            item.name ?? '', // Nafn
            item.profession ?? '', // Starf
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item as any).nationalId ?? '', // Kennitala
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Profession rights data has not been loaded.')
    })
  }

  // Filter - Profession
  const allProfessionOption = formatMessage(t.filterProfessionAll)

  // Filter
  const filteredList = getSortedAndFilteredList(
    list.filter((item) =>
      filterProfession?.value === allProfessionOption
        ? true
        : item.profession === filterProfession?.value,
    ),
    searchTerms,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SEARCH_KEYS as any,
  )

  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const totalPages = Math.ceil(filteredList.length / pageSize)

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
          <GridContainer>
            <GridRow>
              <GridColumn
                paddingTop={[0, 0, 0]}
                paddingBottom={2}
                span={['12/12', '12/12', '12/12', '6/12', '6/12']}
              >
                <Select
                  backgroundColor="white"
                  icon="chevronDown"
                  size="sm"
                  isSearchable
                  label={formatMessage(t.filterProfession)}
                  name="professionSelect"
                  options={availableProfessionOptions}
                  value={filterProfession}
                  onChange={(option) => {
                    setCurrentPageNumber(1)
                    setFilterProfession(option)
                    setFilterValue(option ? option.value : '')
                  }}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
                <Input
                  name="searchInput"
                  placeholder={formatMessage(t.searchPlaceholder)}
                  backgroundColor={['blue', 'blue', 'white']}
                  size="sm"
                  icon={{
                    name: 'search',
                    type: 'outline',
                  }}
                  onChange={(event) => onSearch(event.target.value)}
                />
                <Box textAlign="right" marginRight={1} marginTop={1}>
                  <SyslumennListCsvExport
                    defaultLabel={formatMessage(t.csvButtonLabelDefault)}
                    loadingLabel={formatMessage(t.csvButtonLabelLoading)}
                    errorLabel={formatMessage(t.csvButtonLabelError)}
                    csvFilenamePrefix={formatMessage(t.csvFileTitlePrefix)}
                    csvStringProvider={csvStringProvider}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      {listState === 'loaded' && filteredList.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noResultsFound)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredList.length > 0 && (
        <Box>
          <Box style={tableContainerStyles}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{formatMessage(t.name)}</T.HeadData>
                  <T.HeadData>{formatMessage(t.profession)}</T.HeadData>
                  <T.HeadData align="right">
                    {formatMessage(t.nationalId)}
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredList
                  .slice(
                    (currentPageNumber - 1) * pageSize,
                    currentPageNumber * pageSize,
                  )
                  .map((item, index) => {
                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <Text variant="small">{item.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Box>
                            <Text variant="small">{item.profession}</Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          <Box>
                            <Text variant="small" textAlign="right">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(item as any).nationalId}
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

export default ProfessionRights
