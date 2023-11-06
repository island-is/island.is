import { CSSProperties, useState } from 'react'
import { useQuery } from '@apollo/client/react'

import { ConnectedComponent, Query } from '@island.is/api/schema'
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
import { MasterLicence } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import {
  getNormalizedSearchTerms,
  getSortedAndFilteredList,
  prepareCsvString,
} from '../../utils'
import { GET_MASTER_LICENCES_QUERY } from './queries'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_TABLE_MIN_HEIGHT = '800px'
const SEARCH_KEYS: (keyof MasterLicence)[] = ['name', 'dateOfPublication']

interface MasterListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const MasterList = ({ slice }: MasterListProps) => {
  const n = useNamespace(slice.json ?? {})
  const [listState, setListState] = useState<ListState>('loading')
  const [licences, setLicences] = useState<
    Query['getMasterLicences']['licences']
  >([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const { format } = useDateUtils()

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))
  const [
    availableLicenceProfessionOptions,
    setAvailableLicenceProfessionOptions,
  ] = useState<{ label: string; value: string }[]>([])

  const [filterLicenceProfession, setFilterLicenceProfession] = useState<{
    label: string
    value: string
  } | null>(null)

  const onSearch = (searchString: string) => {
    setCurrentPageNumber(1)
    setSearchString(searchString)
  }

  useQuery<Query>(GET_MASTER_LICENCES_QUERY, {
    onCompleted: (data) => {
      const fetchedMasterLicences = [
        ...(data?.getMasterLicences.licences ?? []),
      ]
      setLicences(fetchedMasterLicences.sort(sortAlpha('name')))
      setListState('loaded')
      const options = [
        allLicenceProfessionOption,
        ...Array.from(
          new Set<string>(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            fetchedMasterLicences.map((x) => x.profession),
          ).values(),
        ),
      ]
        .map((x) => ({
          label: x,
          value: x,
        }))
        .sort(sortAlpha('label'))
      setAvailableLicenceProfessionOptions(options)
      setFilterLicenceProfession(options?.[0])
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (licences) {
        const headerRow = [
          n('csvHeaderMasterLicenceName', 'Nafn'),
          n('csvHeaderMasterLicenseProfession', 'Iðngrein'),
          n('csvHeaderMasterLicenceDateOfPublication', 'Útgáfuár'),
        ]
        const dataRows = []
        for (const licence of licences) {
          dataRows.push([
            licence.name, // Nafn
            licence.profession, // Iðngrein
            licence.dateOfPublication // Útgáfuár
              ? format(new Date(licence.dateOfPublication), 'yyyy')
              : '',
          ])
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Master Licences data has not been loaded.')
    })
  }

  // Filter - Profession
  const allLicenceProfessionOption = n(
    'filterLicenceProfessionAll',
    'Allar tegundir',
  ) as string

  // Filter
  const filteredMasterLicences = getSortedAndFilteredList(
    licences.filter((licence) =>
      filterLicenceProfession?.value === allLicenceProfessionOption
        ? true
        : licence.profession === filterLicenceProfession?.value,
    ),
    searchTerms,
    SEARCH_KEYS,
  )

  const pageSize = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const totalPages = Math.ceil(filteredMasterLicences.length / pageSize)

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
          title={n('errorTitle', 'Villa')}
          message={n(
            'errorMessage',
            'Ekki tókst að sækja lista yfir meistarabréfin.',
          )}
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
                  label={n(
                    'alcoholLicencesFilterLicenceProfession',
                    'Iðngrein',
                  )}
                  name="licenceProfessionSelect"
                  options={availableLicenceProfessionOptions}
                  value={filterLicenceProfession}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={(option: Option) => {
                    setCurrentPageNumber(1)
                    setFilterLicenceProfession(option)
                  }}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
                <Input
                  name="licencesSearchInput"
                  placeholder={n('searchPlaceholder', 'Leita')}
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
                    defaultLabel={n(
                      'csvButtonLabelDefault',
                      'Sækja öll leyfi (CSV)',
                    )}
                    loadingLabel={n(
                      'csvButtonLabelLoading',
                      'Sæki öll leyfi...',
                    )}
                    errorLabel={n(
                      'csvButtonLabelError',
                      'Ekki tókst að sækja leyfi, reyndu aftur',
                    )}
                    csvFilenamePrefix={n('csvFileTitlePrefix', 'Meistarabréf')}
                    csvStringProvider={csvStringProvider}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      {listState === 'loaded' && filteredMasterLicences.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">
            {n('noLicencesFound', 'Engar niðurstöður fundust.')}
          </Text>
        </Box>
      )}
      {listState === 'loaded' && filteredMasterLicences.length > 0 && (
        <Box>
          <Box style={tableContainerStyles}>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>{n('name', 'Nafn')}</T.HeadData>
                  <T.HeadData>{n('profession', 'Iðngrein')}</T.HeadData>
                  <T.HeadData align="right">
                    {n('dateOfPublication', 'Útgáfuár')}
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {filteredMasterLicences
                  .slice(
                    (currentPageNumber - 1) * pageSize,
                    currentPageNumber * pageSize,
                  )
                  .map((licences, index) => {
                    return (
                      <T.Row key={index}>
                        <T.Data>
                          <Text variant="small">{licences.name}</Text>
                        </T.Data>
                        <T.Data>
                          <Box>
                            <Text variant="small">{licences.profession}</Text>
                          </Box>
                        </T.Data>
                        <T.Data>
                          {licences.dateOfPublication && (
                            <Box>
                              <Text textAlign="right" variant="small">
                                {format(
                                  new Date(licences.dateOfPublication),
                                  'yyyy',
                                )}
                              </Text>
                            </Box>
                          )}
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

export default MasterList
