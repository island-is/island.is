import { FC, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_TEMPORARY_EVENT_LICENCES } from './queries'
import { ConnectedComponent, Query } from '@island.is/api/schema'
import { useLocalization } from '../../../utils'
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
} from '@island.is/island-ui/core'
import { SyslumennListCsvExport } from '@island.is/web/components'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

const DEFAULT_PAGE_SIZE = 10

interface TemporaryEventLicencesListProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const TemporaryEventLicencesList: FC<TemporaryEventLicencesListProps> = ({ slice }) => {
  const t = useLocalization(slice.json)
  const { format } = useDateUtils()
  const PAGE_SIZE = slice?.configJson?.pageSize ?? DEFAULT_PAGE_SIZE
  const DATE_FORMAT = t('dateFormat', 'd. MMMM yyyy')

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
        for (const temporaryEventLicence of temporaryEventLicences) {
          dataRows.push([
            temporaryEventLicence.licenceType, // Tegund
            temporaryEventLicence.licenceSubType, // Tegund leyfis
            temporaryEventLicence.licenseNumber, // Leyfisnúmer
            temporaryEventLicence.licenseHolder, // Leyfishafi
            temporaryEventLicence.licenseResponsible, // Ábyrgðarmaður
            temporaryEventLicence.year?.toString(), // Skráningarár
            temporaryEventLicence.validFrom?.toString(), // Gildir frá
            temporaryEventLicence.validTo?.toString(), // Gildir til
            temporaryEventLicence.issuedBy, // Útgefið af
          ])
        }
        return resolve(prepareCsvString(headerRow, dataRows))
      }
      reject('Temporary Event Licences data has not been loaded.')
    })
  }

  const filteredTemporaryEventLicences = temporaryEventLicences.filter((temporaryEventLicence) =>
    textSearch(searchTerms, [
      // Fields to search
      temporaryEventLicence.licenceType,
      temporaryEventLicence.licenseHolder,
      temporaryEventLicence.licenseNumber,
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
          title={t('errorTitle', 'Villa')}
          message={t('errorMessage', 'Ekki tókst að sækja tækifærisleyfi.')}
          type="error"
        />
      )}
      {listState === 'loaded' && (
        <Box marginBottom={3}>
          <Input
            name="temporaryEventLicencesSearchInput"
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
              csvFilenamePrefix={t('csvFileTitlePrefix', 'Tækifærisleyfi')}
              csvStringProvider={csvStringProvider}
            />
          </Box>
        </Box>
      )}
      {listState === 'loaded' && filteredTemporaryEventLicences.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{t('noResults', 'Engin leyfi fundust.')}</Text>
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
                        {temporaryEventLicence.licenceType} -{' '}
                        {temporaryEventLicence.licenceSubType}
                      </Text>
                      <Box marginBottom={[2, 2, 2, 0]}>
                        <Tag disabled>{temporaryEventLicence.issuedBy}</Tag>
                      </Box>
                    </Box>
                    <Box>
                      <Text variant="h3">{temporaryEventLicence.licenseHolder}</Text>

                      <Text paddingBottom={2}>
                        {t('licenseNumber', 'Leyfisnúmer')}:{' '}
                        {temporaryEventLicence.licenseNumber}
                      </Text>

                      <Text>
                        {t('validPeriodLabel', 'Gildistími')}:{' '}
                        {getValidPeriodRepresentation(
                          temporaryEventLicence.validFrom,
                          temporaryEventLicence.validTo,
                          DATE_FORMAT,
                          format,
                          t('validPeriodUntil', 'Til'),
                          t('validPeriodIndefinite', 'Ótímabundið'),
                        )}
                      </Text>

                      <Text>
                        {t('issuedAtYear', 'Skráningarár')}:{' '}
                        {temporaryEventLicence.year}
                      </Text>

                      <Text>
                        {t('licenseResponsible', 'Ábyrgðarmaður')}:{' '}
                        {temporaryEventLicence.licenseResponsible ||
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
            {showCount < filteredTemporaryEventLicences.length && (
              <Button onClick={() => setShowCount(showCount + PAGE_SIZE)}>
                {t('loadMore', 'Sjá fleiri')} (
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
