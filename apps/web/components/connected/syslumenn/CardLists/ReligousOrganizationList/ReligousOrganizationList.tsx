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
  ReligousOrganization,
} from '@island.is/web/graphql/schema'

import {
  getNormalizedSearchTerms,
  prepareCsvString,
  textSearch,
} from '../../utils'
import { GET_RELIGOUS_ORGANIZATIONS_QUERY } from './queries'
import { m } from './translation.strings'

const DEFAULT_PAGE_SIZE = 10

const formatHomeAddress = (item: ReligousOrganization) => {
  if (!item.homeAddress) {
    if (item.municipality) return item.municipality
    else return ''
  }

  return `${item.homeAddress ?? ''}${
    Boolean(item.postalCode) || Boolean(item.municipality) ? ',' : ''
  } ${item.postalCode ?? ''} ${item.municipality ?? ''}`
}

interface ReligousOrganizationListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

export const ReligousOrganizationList: FC<
  React.PropsWithChildren<ReligousOrganizationListProps>
> = ({ slice }) => {
  const { formatMessage } = useIntl()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [religousOrganizations, setReligousOrganizations] = useState<
    Query['getReligousOrganizations']['list']
  >([])

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
  }

  useQuery<Query>(GET_RELIGOUS_ORGANIZATIONS_QUERY, {
    onCompleted: (data) => {
      setReligousOrganizations([
        ...(data?.getReligousOrganizations?.list ?? []),
      ])
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (religousOrganizations) {
        const headerRow = [
          formatMessage(m.name),
          formatMessage(m.director),
          formatMessage(m.homeAddress),
        ]
        const dataRows = []
        for (const item of religousOrganizations) {
          dataRows.push([
            item.name ?? '',
            item.director ?? '',
            formatHomeAddress(item),
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Religous organization list data has not been loaded.')
    })
  }

  // Filter
  const filteredReligousOrganizations = religousOrganizations.filter((item) =>
    // Filter by search string
    textSearch(searchTerms, [
      // Fields to search
      item.name ?? '',
      item.director ?? '',
      item.homeAddress ?? '',
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
                  name="ReligousOrganizationsSearchInput"
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
      {listState === 'loaded' && filteredReligousOrganizations.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(m.noResults)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredReligousOrganizations.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {filteredReligousOrganizations
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
                          {formatMessage(m.homeAddress)}: {item.homeAddress}
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
            {showCount < filteredReligousOrganizations.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {formatMessage(m.loadMore)} (
                {filteredReligousOrganizations.length - showCount})
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
