import { FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_ALCOHOL_LICENCES_QUERY } from './queries'
import {
  AlcoholLicence,
  ConnectedComponent,
  Query,
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

interface AlcoholLicencesListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const AlcoholLicencesList: FC<
  React.PropsWithChildren<AlcoholLicencesListProps>
> = ({ slice }) => {
  const n = useNamespace(slice.json ?? {})
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = n('dateFormat', 'd. MMMM yyyy')

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [alcoholLicences, setAlcoholLicences] = useState<
    Query['getAlcoholLicences']
  >([])

  const [searchTerms, _setSearchTerms] = useState([] as string[])
  const setSearchString = (searchString: string) =>
    _setSearchTerms(getNormalizedSearchTerms(searchString))

  const onSearch = (searchString: string) => {
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
  }

  const getLicenceTypeRepresentation = (licence: AlcoholLicence): string => {
    let result = licence.licenceType
    if (
      licence.licenceSubType &&
      licence.licenceSubType !== licence.licenceType
    ) {
      // Add the subtype, but only if it's not redundant
      result += ' - ' + licence.licenceSubType
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    return result
  }

  useQuery<Query>(GET_ALCOHOL_LICENCES_QUERY, {
    onCompleted: (data) => {
      setAlcoholLicences([...(data?.getAlcoholLicences ?? [])])
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (alcoholLicences) {
        const headerRow = [
          n('csvHeaderLicenceType', 'Tegund'),
          n('csvHeaderLicenceSubType', 'Tegund leyfis'),
          n('csvHeaderLicenseNumber', 'Leyfisnúmer'),
          n('csvHeaderLicenseHolder', 'Leyfishafi'),
          n('csvHeaderLicenseResponsible', 'Ábyrgðarmaður'),
          n('csvHeaderValidFrom', 'Gildir frá'),
          n('csvHeaderValidTo', 'Gildir til'),
          n('csvHeaderOffice', 'Embætti'),
          n('csvHeaderLocation', 'Starfsstöð embættis'),
        ]
        const dataRows = []
        for (const alcoholLicence of alcoholLicences) {
          dataRows.push([
            alcoholLicence.licenceType, // Tegund
            alcoholLicence.licenceSubType, // Tegund leyfis
            alcoholLicence.licenseNumber, // Leyfisnúmer
            alcoholLicence.licenseHolder, // Leyfishafi
            alcoholLicence.licenseResponsible, // Ábyrgðarmaður
            alcoholLicence.validFrom?.toString(), // Gildir frá
            alcoholLicence.validTo?.toString(), // Gildir til
            alcoholLicence.office, // Embætti
            alcoholLicence.location, // Starfsstöð embættis
          ])
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Alcohol Licences data has not been loaded.')
    })
  }

  // Filter - Office
  const allOfficesOption = n('filterOfficeAll', 'Öll embætti')
  const avaibleOfficesOptions = [
    allOfficesOption,
    ...Array.from(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      new Set<string>(alcoholLicences.map((x) => x.office)).values(),
    ),
  ]
  const [filterOffice, setFilterOffice] = useState<string>(
    avaibleOfficesOptions[0],
  )

  // Filter - Type
  const allLicenceTypeOption = n('filterLicenceTypeAll', 'Allar tegundir')
  const avaibleLicenceTypeOptions = [
    allLicenceTypeOption,
    ...Array.from(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      new Set<string>(alcoholLicences.map((x) => x.licenceType)).values(),
    ),
  ]
  const [filterLicenceType, setFilterLicenceType] = useState<string>(
    avaibleLicenceTypeOptions[0],
  )

  // Filter
  const filteredAlcoholLicences = alcoholLicences.filter(
    (alcoholLicence) =>
      // Filter by Office
      (filterOffice === allOfficesOption
        ? true
        : alcoholLicence.office === filterOffice) &&
      // Filter by Licence type
      (filterLicenceType === allLicenceTypeOption
        ? true
        : alcoholLicence.licenceType === filterLicenceType) &&
      // Filter by search string
      textSearch(searchTerms, [
        // Fields to search
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        alcoholLicence.licenceType,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        alcoholLicence.licenseHolder,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        alcoholLicence.licenseNumber,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        alcoholLicence.licenseResponsible,
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
          message={n('errorMessage', 'Ekki tókst að sækja áfengisleyfi.')}
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
                  label={n('alcoholLicencesFilterLicenceType', 'Tegund')}
                  name="licenceTypeSelect"
                  options={avaibleLicenceTypeOptions.map((x) => ({
                    label: x,
                    value: x,
                  }))}
                  value={avaibleLicenceTypeOptions
                    .map((x) => ({
                      label: x,
                      value: x,
                    }))
                    .find((x) => x.value === filterLicenceType)}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={({ value }: Option) => {
                    setFilterLicenceType(String(value))
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
                  name="alcoholLicencesSearchInput"
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
                    csvFilenamePrefix={n('csvFileTitlePrefix', 'Áfengisleyfi')}
                    csvStringProvider={csvStringProvider}
                  />
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      {listState === 'loaded' && filteredAlcoholLicences.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{n('noResults', 'Engin leyfi fundust.')}</Text>
        </Box>
      )}
      {listState === 'loaded' && filteredAlcoholLicences.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {filteredAlcoholLicences
              .slice(0, showCount)
              .map((alcoholLicence, index) => {
                return (
                  <Box
                    key={`alcohol-licence-${index}`}
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
                        {getLicenceTypeRepresentation(alcoholLicence)}
                      </Text>
                      <Box marginBottom={[2, 2, 2, 0]}>
                        <Tag disabled>
                          {alcoholLicence.office}
                          {alcoholLicence.location &&
                            ` - ${alcoholLicence.location}`}
                        </Tag>
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="h3">{alcoholLicence.licenseHolder}</Text>

                      <Text paddingBottom={2}>
                        {n('licenseNumber', 'Leyfisnúmer')}:{' '}
                        {alcoholLicence.licenseNumber}
                      </Text>

                      <Text>
                        {n('validPeriodLabel', 'Gildistími')}:{' '}
                        {getValidPeriodRepresentation(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          alcoholLicence.validFrom,
                          alcoholLicence.validTo,
                          DATE_FORMAT,
                          format,
                          n('validPeriodUntil', 'Til'),
                          n('validPeriodIndefinite', 'Ótímabundið'),
                        )}
                      </Text>

                      <Text>
                        {n('licenseResponsible', 'Ábyrgðarmaður')}:{' '}
                        {alcoholLicence.licenseResponsible ||
                          n(
                            'licenseResponsibleNotRegistered',
                            'Enginn skráður',
                          )}
                      </Text>
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
            {showCount < filteredAlcoholLicences.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {n('loadMore', 'Sjá fleiri')} (
                {filteredAlcoholLicences.length - showCount})
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default AlcoholLicencesList
