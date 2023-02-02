import { FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_ALCOHOL_LICENCES_QUERY } from './queries'
import {
  AlcoholLicence,
  ConnectedComponent,
  Query,
} from '@island.is/api/schema'
import { useLocalization } from '../../../utils'
import { prepareCsvString } from '../../utils'
import {
  Box,
  Button,
  Tag,
  LoadingDots,
  Text,
  Input,
  AlertMessage,
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const DEFAULT_PAGE_SIZE = 10

interface AlcoholLicencesListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const AlcoholLicencesList: FC<AlcoholLicencesListProps> = ({ slice }) => {
  const t = useLocalization(slice.json)
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = t('dateFormat', 'd. MMMM yyyy')

  const [listState, setListState] = useState<ListState>('loading')
  const [showCount, setShowCount] = useState(PAGE_SIZE)
  const [alcoholLicences, setAlcoholLicences] = useState<
    Query['getAlcoholLicences']
  >([])

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
    setSearchString(searchString)
    setShowCount(PAGE_SIZE)
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

  const getLicenseValidPeriod = (license: AlcoholLicence) => {
    const validFrom = license.validFrom ? new Date(license.validFrom) : null
    const validTo = license.validTo ? new Date(license.validTo) : null

    if (validFrom && validTo) {
      return `${format(validFrom, DATE_FORMAT)} - ${format(
        validTo,
        DATE_FORMAT,
      )}`
    }
    if (!validFrom && validTo) {
      return `${t('validUntil', 'Til')} ${format(validTo, DATE_FORMAT)}`
    }
    if (!validTo) {
      return t('validPeriodIndefinite', 'Ótímabundið')
    }
  }

  const csvStringProvider = () => {
    return new Promise<string>((resolve, reject) => {
      if (alcoholLicences) {
        const headerRow = [
          'Málategund',
          'Tegund',
          'Tegund leyfis',
          'Leyfisnúmer',
          'Leyfishafi',
          'Ábyrgðarmaður',
          'Skráningarár',
          'Gildir frá',
          'Gildir til',
          'Útgefið af',
        ]
        const dataRows = []
        for (const alcoholLicence of alcoholLicences) {
          dataRows.push([
            alcoholLicence.caseType, // Málategund
            alcoholLicence.licenceType, // Tegund
            alcoholLicence.licenceSubType, // Tegund leyfis
            alcoholLicence.licenseNumber, // Leyfisnúmer
            alcoholLicence.licenseHolder, // Leyfishafi
            alcoholLicence.licenseResponsible, // Ábyrgðarmaður
            alcoholLicence.year?.toString(), // Skráningarár
            alcoholLicence.validFrom?.toString(), // Gildir frá
            alcoholLicence.validTo?.toString(), // Gildir til
            alcoholLicence.issuedBy, // Útgefið af
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Alcohol Licences data has not been loaded.')
    })
  }

  const filteredAlcoholLicences = alcoholLicences.filter((alcoholLicence) => {
    return searchTerms.every(
      (searchTerm) =>
        // TODO: Search more fields.
        alcoholLicence.licenseHolder
          ?.trim()
          .toLowerCase()
          .includes(searchTerm) ||
        alcoholLicence.licenceType?.trim().toLowerCase().includes(searchTerm),
    )
  })

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
          message={t('errorMessage', 'Ekki tókst að sækja áfengisleyfi.')}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={3}>
          <Input
            name="alcoholLicencesSearchInput"
            placeholder={t('searchPlaceholder', 'Leita')}
            backgroundColor={['blue', 'blue', 'white']}
            size="sm"
            icon="search"
            iconType="outline"
            onChange={(event) => onSearch(event.target.value)}
          />
          <Box textAlign="right" marginRight={1} marginTop={1}>
            <SyslumennListCsvExport
              defaultLabel={t('csvButtonLabelDefault', 'Sækja öll leyfi (CSV)')}
              loadingLabel={t('csvButtonLabelLoading', 'Sæki öll leyfi...')}
              errorLabel={t(
                'csvButtonLabelError',
                'Ekki tókst að sækja leyfi, reyndu aftur',
              )}
              csvFilenamePrefix={t('csvFileTitlePrefix', 'Áfengisleyfi')}
              csvStringProvider={csvStringProvider}
            />
          </Box>
        </Box>
      )}
      {listState === 'loaded' && filteredAlcoholLicences.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{t('noResults', 'Engin leyfi fundust.')}</Text>
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
                        {alcoholLicence.licenceType} -{' '}
                        {alcoholLicence.licenceSubType}
                      </Text>
                      <Box marginBottom={[2, 2, 2, 0]}>
                        <Tag disabled>{alcoholLicence.issuedBy}</Tag>
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="h3">{alcoholLicence.licenseHolder}</Text>

                      <Text paddingBottom={2}>
                        {t('licenseNumber', 'Leyfisnúmer')}:{' '}
                        {alcoholLicence.licenseNumber}
                      </Text>

                      <Text>
                        {t('validPeriod', 'Gildistími')}:{' '}
                        {getLicenseValidPeriod(alcoholLicence)}
                      </Text>

                      <Text>
                        {t('issuedAtYear', 'Skráningarár')}:{' '}
                        {alcoholLicence.year}
                      </Text>

                      <Text>
                        {t('licenseResponsible', 'Ábyrgðarmaður')}:{' '}
                        {alcoholLicence.licenseResponsible ||
                          t(
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
                {t('seeMore', 'Sjá fleiri')} (
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
