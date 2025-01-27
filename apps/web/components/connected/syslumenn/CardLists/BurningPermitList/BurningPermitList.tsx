import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client/react'

import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  LoadingDots,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import { ConnectedComponent, Query } from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import {
  getNormalizedSearchTerms,
  prepareCsvString,
  textSearch,
} from '../../utils'
import { GET_BURNING_PERMITS_QUERY } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 10

interface BurningPermitListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

export const BurningPermitList: FC<
  React.PropsWithChildren<BurningPermitListProps>
> = ({ slice }) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = formatMessage(t.dateFormat)

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [burningPermits, setBurningPermits] = useState<
    Query['getBurningPermits']['list']
  >([])

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
  }

  useQuery<Query>(GET_BURNING_PERMITS_QUERY, {
    onCompleted: (data) => {
      setBurningPermits([...(data?.getBurningPermits?.list ?? [])])
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (burningPermits) {
        const headerRow = [
          formatMessage(t.licensee),
          formatMessage(t.place),
          formatMessage(t.responsibleParty),
          formatMessage(t.office),
          formatMessage(t.date),
          formatMessage(t.type),
          formatMessage(t.subtype),
        ]
        const dataRows = []
        for (const permit of burningPermits) {
          dataRows.push([
            permit.licensee ?? '',
            permit.place ?? '',
            permit.responsibleParty ?? '',
            permit.office ?? '',
            permit.date ? format(new Date(permit.date), DATE_FORMAT) : '',
            permit.type ?? '',
            permit.subtype ?? '',
          ])
        }

        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Burning permit list data has not been loaded.')
    })
  }

  // Filter
  const filteredburningPermits = burningPermits.filter((permit) =>
    // Filter by search string
    textSearch(searchTerms, [
      // Fields to search
      permit.licensee ?? '',
      permit.place ?? '',
      permit.responsibleParty ?? '',
    ]),
  )

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
        <Box marginBottom={2}>
          <GridContainer>
            <GridRow>
              <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
                <Input
                  name="burningPermitsSearchInput"
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
      {listState === 'loaded' && filteredburningPermits.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noResults)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredburningPermits.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {filteredburningPermits.slice(0, showCount).map((permit, index) => {
              return (
                <Box
                  key={`burning-permit-${index}`}
                  borderWidth="standard"
                  borderColor="standard"
                  borderRadius="standard"
                  paddingX={4}
                  paddingY={3}
                  marginBottom={4}
                >
                  <Box
                    alignItems="flexStart"
                    display="flex"
                    flexDirection={[
                      'columnReverse',
                      'columnReverse',
                      'columnReverse',
                      'row',
                    ]}
                    justifyContent="spaceBetween"
                  >
                    {Boolean(permit.date) && (
                      <Text variant="eyebrow" color="purple400" paddingTop={1}>
                        {format(new Date(permit.date as Date), DATE_FORMAT)}
                      </Text>
                    )}
                    <Tag disabled>{permit.office}</Tag>
                  </Box>
                  <Text variant="h3">{permit.licensee}</Text>
                  <Box paddingTop={2}>
                    {Boolean(permit.place) && (
                      <Text>
                        {formatMessage(t.place)}: {permit.place}
                      </Text>
                    )}
                    {Boolean(permit.responsibleParty) && (
                      <Text>
                        {formatMessage(t.responsibleParty)}:{' '}
                        {permit.responsibleParty}
                      </Text>
                    )}
                    {Boolean(permit.type) && (
                      <Text>
                        {formatMessage(t.type)}: {permit.type}
                      </Text>
                    )}
                    {Boolean(permit.subtype) && (
                      <Text>
                        {formatMessage(t.subtype)}: {permit.subtype}
                      </Text>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            marginY={3}
            textAlign="center"
          >
            {showCount < filteredburningPermits.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {formatMessage(t.loadMore)} (
                {filteredburningPermits.length - showCount})
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
