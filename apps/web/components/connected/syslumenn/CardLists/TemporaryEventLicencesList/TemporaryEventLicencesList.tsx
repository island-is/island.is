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
  Select,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import {
  ConnectedComponent,
  Maybe,
  Query,
  TemporaryEventLicence,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import {
  getNormalizedSearchTerms,
  getValidPeriodRepresentation,
  prepareCsvString,
  textSearch,
} from '../../utils'
import { GET_TEMPORARY_EVENT_LICENCES } from './queries'
import { translation as t } from './translation.strings'

const DEFAULT_PAGE_SIZE = 10

interface TemporaryEventLicencesListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const TemporaryEventLicencesList: FC<
  React.PropsWithChildren<TemporaryEventLicencesListProps>
> = ({ slice }) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = formatMessage(t.dateFormat)

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [temporaryEventLicences, setTemporaryEventLicences] = useState<
    Query['getTemporaryEventLicences']
  >([])

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
  }

  const getLicenceTypeRepresentation = (
    licence: TemporaryEventLicence,
  ): Maybe<string> | undefined => {
    let result = licence.licenceType
    if (
      licence.licenceSubType &&
      licence.licenceSubType !== licence.licenceType
    ) {
      // Add the subtype, but only if it's not redundant
      result += ' - ' + licence.licenceSubType
    }
    return result
  }

  useQuery<Query>(GET_TEMPORARY_EVENT_LICENCES, {
    onCompleted: (data) => {
      setTemporaryEventLicences([...(data?.getTemporaryEventLicences ?? [])])
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (temporaryEventLicences) {
        const headerRow = [
          formatMessage(t.csvHeaderLicenceType),
          formatMessage(t.csvHeaderLicenceSubType),
          formatMessage(t.csvHeaderLicenseNumber),
          formatMessage(t.csvHeaderLicenseHolder),
          formatMessage(t.csvHeaderLicenseResponsible),
          formatMessage(t.csvHeaderValidFrom),
          formatMessage(t.csvHeaderValidTo),
          formatMessage(t.csvHeaderIssuedBy),
        ]
        const dataRows = []
        for (const temporaryEventLicence of temporaryEventLicences) {
          dataRows.push([
            temporaryEventLicence.licenceType ?? '', // Tegund
            temporaryEventLicence.licenceSubType ?? '', // Tegund leyfis
            temporaryEventLicence.licenseNumber ?? '', // Leyfisnúmer
            temporaryEventLicence.licenseHolder ?? '', // Leyfishafi
            temporaryEventLicence.licenseResponsible ?? '', // Ábyrgðarmaður
            temporaryEventLicence.validFrom?.toString() ?? '', // Gildir frá
            temporaryEventLicence.validTo?.toString() ?? '', // Gildir til
            temporaryEventLicence.issuedBy ?? '', // Útgefið af
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Temporary Event Licences data has not been loaded.')
    })
  }

  // Filter - Office
  const allOfficesOption = formatMessage(t.filterOfficeAll)
  const avaibleOfficesOptions = [
    allOfficesOption,
    ...Array.from(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      new Set<string>(temporaryEventLicences.map((x) => x.issuedBy)).values(),
    ),
  ]
  const [filterOffice, setFilterOffice] = useState<string>(
    avaibleOfficesOptions[0],
  )

  // Filter - SubType
  const allLicenceSubTypeOption = formatMessage(t.filterLicenceSubTypeAll)
  const avaibleLicenceSubTypeOptions = [
    allLicenceSubTypeOption,
    ...Array.from(
      new Set<string>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicences.map((x) => x.licenceSubType),
      ).values(),
    ),
  ]
  const [filterLicenceSubType, setFilterLicenceSubType] = useState<string>(
    avaibleLicenceSubTypeOptions[0],
  )

  const filteredTemporaryEventLicences = temporaryEventLicences.filter(
    (temporaryEventLicence) =>
      // Filter by Office
      (filterOffice === allOfficesOption
        ? true
        : temporaryEventLicence.issuedBy === filterOffice) &&
      // Filter by Licence SubType
      (filterLicenceSubType === allLicenceSubTypeOption
        ? true
        : temporaryEventLicence.licenceSubType === filterLicenceSubType) &&
      // Filter by search string
      textSearch(searchTerms, [
        // Fields to search
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicence.licenceType,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicence.licenceSubType,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicence.licenseHolder,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicence.licenseNumber,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        temporaryEventLicence.licenseResponsible,
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
                  label={formatMessage(t.alcoholLicencesFilterLicenceSubType)}
                  name="licenceSubTypeSelect"
                  options={avaibleLicenceSubTypeOptions.map((x) => ({
                    label: x,
                    value: x,
                  }))}
                  value={avaibleLicenceSubTypeOptions
                    .map((x) => ({
                      label: x,
                      value: x,
                    }))
                    .find((x) => x.value === filterLicenceSubType)}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={({ value }: Option) => {
                    setFilterLicenceSubType(String(value))
                  }}
                />
              </GridColumn>
              <GridColumn
                paddingBottom={2}
                span={['12/12', '12/12', '12/12', '6/12', '6/12']}
              >
                <Select
                  backgroundColor="white"
                  icon="chevronDown"
                  size="sm"
                  isSearchable
                  label={formatMessage(t.alcoholLicencesFilterOffice)}
                  name="officeSelect"
                  options={avaibleOfficesOptions.map((x) => ({
                    label: x,
                    value: x,
                  }))}
                  value={avaibleOfficesOptions
                    .map((x) => ({
                      label: x,
                      value: x,
                    }))
                    .find((x) => x.value === filterOffice)}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={({ value }: Option) => {
                    setFilterOffice(String(value))
                  }}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
                <Input
                  name="temporaryEventLicencesSearchInput"
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
      {listState === 'loaded' && filteredTemporaryEventLicences.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{formatMessage(t.noResults)}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredTemporaryEventLicences.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {filteredTemporaryEventLicences
              .slice(0, showCount)
              .map((temporaryEventLicence, index) => {
                return (
                  <Box
                    key={`temporary-event-licence-${index}`}
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
                      <Text variant="eyebrow" color="purple400" paddingTop={1}>
                        {getLicenceTypeRepresentation(temporaryEventLicence)}
                      </Text>
                      <Box marginBottom={[2, 2, 2, 0]}>
                        <Tag disabled>{temporaryEventLicence.issuedBy}</Tag>
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="h3">
                        {temporaryEventLicence.licenseHolder}
                      </Text>

                      <Box paddingBottom={2}>
                        {Boolean(temporaryEventLicence.location) && (
                          <Text>{temporaryEventLicence.location}</Text>
                        )}
                      </Box>

                      <Text>
                        {formatMessage(t.licenseNumber)}:{' '}
                        {temporaryEventLicence.licenseNumber}
                      </Text>

                      <Text>
                        {formatMessage(t.validPeriodLabel)}:{' '}
                        {getValidPeriodRepresentation(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          temporaryEventLicence.validFrom,
                          temporaryEventLicence.validTo,
                          DATE_FORMAT,
                          format,
                          formatMessage(t.validPeriodUntil),
                          formatMessage(t.validPeriodIndefinite),
                        )}
                      </Text>

                      <Text>
                        {formatMessage(t.licenseResponsible)}:{' '}
                        {temporaryEventLicence.licenseResponsible ||
                          formatMessage(t.licenseResponsibleNotRegistered)}
                      </Text>

                      {Boolean(
                        temporaryEventLicence.estimatedNumberOfGuests,
                      ) && (
                        <Text>
                          {formatMessage(t.licenseEstimatedNumberOfGuests)}:{' '}
                          {temporaryEventLicence.estimatedNumberOfGuests}
                        </Text>
                      )}

                      {Boolean(temporaryEventLicence.maximumNumberOfGuests) && (
                        <Text>
                          {formatMessage(t.licenseMaximumNumberOfGuests)}:{' '}
                          {temporaryEventLicence.maximumNumberOfGuests}
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
            {showCount < filteredTemporaryEventLicences.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {formatMessage(t.loadMore)} (
                {filteredTemporaryEventLicences.length - showCount})
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default TemporaryEventLicencesList
