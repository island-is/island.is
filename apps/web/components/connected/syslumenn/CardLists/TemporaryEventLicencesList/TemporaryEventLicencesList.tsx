import { FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_TEMPORARY_EVENT_LICENCES } from './queries'
import {
  ConnectedComponent,
  Maybe,
  Query,
  TemporaryEventLicence,
} from '@island.is/web/graphql/schema'
import {
  prepareCsvString,
  textSearch,
  getNormalizedSearchTerms,
  getValidPeriodRepresentation,
} from '../../utils'
import {
  Box,
  Button,
  Tag,
  LoadingDots,
  Text,
  Input,
  AlertMessage,
  Select,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const DEFAULT_PAGE_SIZE = 10

interface TemporaryEventLicencesListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const TemporaryEventLicencesList: FC<
  React.PropsWithChildren<TemporaryEventLicencesListProps>
> = ({ slice }) => {
  const n = useNamespace(slice.json ?? {})
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = n('dateFormat', "d. MMMM yyyy 'kl.' HH:mm")

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
          n('csvHeaderLicenceType', 'Tegund'),
          n('csvHeaderLicenceSubType', 'Tegund leyfis'),
          n('csvHeaderLicenseNumber', 'Leyfisnúmer'),
          n('csvHeaderLicenseHolder', 'Leyfishafi'),
          n('csvHeaderLicenseResponsible', 'Ábyrgðarmaður'),
          n('csvHeaderValidFrom', 'Gildir frá'),
          n('csvHeaderValidTo', 'Gildir til'),
          n('csvHeaderIssuedBy', 'Útgefið af'),
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
  const allOfficesOption = n('filterOfficeAll', 'Öll embætti')
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
  const allLicenceSubTypeOption = n('filterLicenceSubTypeAll', 'Allar tegundir')
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
          title={n('errorTitle', 'Villa')}
          message={n('errorMessage', 'Ekki tókst að sækja tækifærisleyfi.')}
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
                  label={n('alcoholLicencesFilterLicenceSubType', 'Tegund')}
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
                  label={n('alcoholLicencesFilterOffice', 'Embætti')}
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
                    csvFilenamePrefix={n(
                      'csvFileTitlePrefix',
                      'Tækifærisleyfi',
                    )}
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
          <Text variant="h3">{n('noResults', 'Engin leyfi fundust.')}</Text>
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

                      <Text paddingBottom={2}>
                        {n('licenseNumber', 'Leyfisnúmer')}:{' '}
                        {temporaryEventLicence.licenseNumber}
                      </Text>

                      <Text>
                        {n('validPeriodLabel', 'Gildistími')}:{' '}
                        {getValidPeriodRepresentation(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          temporaryEventLicence.validFrom,
                          temporaryEventLicence.validTo,
                          DATE_FORMAT,
                          format,
                          n('validPeriodUntil', 'Til'),
                          n('validPeriodIndefinite', 'Ótímabundið'),
                        )}
                      </Text>

                      <Text>
                        {n('licenseResponsible', 'Ábyrgðarmaður')}:{' '}
                        {temporaryEventLicence.licenseResponsible ||
                          n(
                            'licenseResponsibleNotRegistered',
                            'Enginn skráður',
                          )}
                      </Text>

                      {temporaryEventLicence.estimatedNumberOfGuests && (
                        <Text>
                          {n(
                            'licenseEstimatedNumberOfGuests',
                            'Áætlaður fjöldi gesta',
                          )}
                          : {temporaryEventLicence.estimatedNumberOfGuests}
                        </Text>
                      )}

                      {temporaryEventLicence.maximumNumberOfGuests && (
                        <Text>
                          {n(
                            'licenseMaximumNumberOfGuests',
                            'Hámarksfjöldi gesta',
                          )}
                          : {temporaryEventLicence.maximumNumberOfGuests}
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
                {n('loadMore', 'Sjá fleiri')} (
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
