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
  Text,
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import {
  ConnectedComponent,
  Query,
  ReligiousOrganization,
} from '@island.is/web/graphql/schema'

import {
  getNormalizedSearchTerms,
  prepareCsvString,
  textSearch,
} from '../../utils'
import { GET_RELIGIOUS_ORGANIZATIONS_QUERY } from './queries'
import { m } from './translation.strings'

const DEFAULT_PAGE_SIZE = 10

const formatHomeAddress = (item: ReligiousOrganization) => {
  if (!item.homeAddress) {
    if (item.municipality) return item.municipality
    else return ''
  }

  return `${item.homeAddress ?? ''}${
    Boolean(item.postalCode) || Boolean(item.municipality) ? ',' : ''
  } ${item.postalCode ?? ''} ${item.municipality ?? ''}`
}

interface ReligiousOrganizationListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

export const ReligiousOrganizationList: FC<
  React.PropsWithChildren<ReligiousOrganizationListProps>
> = ({ slice }) => {
  const { formatMessage } = useIntl()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [religiousOrganizations, setReligiousOrganizations] = useState<
    Query['getReligiousOrganizations']['list']
  >([])

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
  }

  useQuery<Query>(GET_RELIGIOUS_ORGANIZATIONS_QUERY, {
    onCompleted: (data) => {
      setReligiousOrganizations([
        ...(data?.getReligiousOrganizations?.list ?? []),
      ])
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (religiousOrganizations) {
        const headerRow = [
          formatMessage(m.name),
          formatMessage(m.director),
          formatMessage(m.homeAddress),
        ]
        const dataRows = []
        for (const item of religiousOrganizations) {
          dataRows.push([
            item.name ?? '',
            item.director ?? '',
            formatHomeAddress(item),
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Religious organization list data has not been loaded.')
    })
  }

  // Filter
  const filteredReligiousOrganizations = religiousOrganizations.filter((item) =>
    // Filter by search string
    textSearch(searchTerms, [
      // Fields to search
      item.name ?? '',
      item.director ?? '',
      formatHomeAddress(item),
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
          title={formatMessage(m.errorTitle)}
          message={formatMessage(m.errorMessage)}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={2}>
          <GridContainer>
            <GridRow>
              <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
                <Input
                  name="ReligiousOrganizationsSearchInput"
                  placeholder={formatMessage(m.searchPlaceholder)}
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
                    defaultLabel={formatMessage(m.csvButtonLabelDefault)}
                    loadingLabel={formatMessage(m.csvButtonLabelLoading)}
                    errorLabel={formatMessage(m.csvButtonLabelError)}
                    csvFilenamePrefix={formatMessage(m.csvFileTitlePrefix)}
                    csvStringProvider={csvStringProvider}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      {listState === 'loaded' && filteredReligiousOrganizations.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(m.noResults)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredReligiousOrganizations.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {filteredReligiousOrganizations
              .slice(0, showCount)
              .map((item, index) => {
                return (
                  <Box
                    key={index}
                    borderWidth="standard"
                    borderColor="standard"
                    borderRadius="standard"
                    paddingX={4}
                    paddingY={3}
                    marginBottom={4}
                  >
                    <Text variant="h3">{item.name}</Text>

                    <Box paddingTop={2}>
                      {Boolean(item.director) && (
                        <Text>
                          {formatMessage(m.director)}: {item.director}
                        </Text>
                      )}
                      {Boolean(item.homeAddress) && (
                        <Text>
                          {formatMessage(m.homeAddress)}:{' '}
                          {formatHomeAddress(item)}
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
            {showCount < filteredReligiousOrganizations.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {formatMessage(m.loadMore)} (
                {filteredReligiousOrganizations.length - showCount})
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
