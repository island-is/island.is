import { HealthDirectoratePatientDataApprovalCountry } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Inline,
  Input,
  SkeletonLoader,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import { PermitInput } from '../../utils/types'
import { useHealthDirectoratePatientDataPermitCountriesQuery } from './FirstStep.generated'
import * as styles from './PatientDataPermit.css'

interface CountriesProps {
  onClick: () => void
  formState?: PermitInput
  setFormState: Dispatch<SetStateAction<PermitInput | undefined>>
}

const Countries: FC<CountriesProps> = ({
  onClick,
  setFormState,
  formState,
}) => {
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [selectedCountries, setSelectedCountries] = useState<
    HealthDirectoratePatientDataApprovalCountry[]
  >(formState?.countries ?? [])
  const [selectAll, setSelectAll] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data, error, loading } =
    useHealthDirectoratePatientDataPermitCountriesQuery({
      variables: {
        locale: lang,
      },
    })

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const countries = data?.healthDirectoratePatientDataPermitCountries.data || []

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '1', second: '3' })}
      </Text>
      <Inline>
        <Text variant="h5" marginTop={1} marginBottom={3}>
          {formatMessage(messages.whatCountriesShouldPermitApply)}
        </Text>
        <Tooltip
          text={formatMessage(messages.countriesTooltip)}
          placement={isMobile ? 'bottom' : 'right'}
        />
      </Inline>
      {loading && !error && (
        <Box className={styles.countryCheckboxContainer}>
          <Box marginBottom={3} marginRight={3}>
            <SkeletonLoader height={80} />
          </Box>
          <Box marginBottom={3} marginRight={3}>
            <SkeletonLoader height={80} />
          </Box>
          <Box marginBottom={3} marginRight={3}>
            <SkeletonLoader height={80} />
          </Box>
        </Box>
      )}
      {!loading && countries.length === 0 && (
        <AlertMessage
          type="warning"
          title={formatMessage(messages.countriesError)}
        />
      )}

      {countries.length > 0 && (
        <>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems="center"
            flexWrap={['wrap', 'wrap', 'nowrap']}
            rowGap={2}
          >
            <Box width={isMobile ? 'full' : undefined}>
              <Input
                name="countrySearch"
                placeholder={formatMessage(messages.filterByCountry)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={{ type: 'outline', name: 'search' }}
                size="xs"
                backgroundColor="blue"
              />
            </Box>
            <Box marginLeft={[0, 0, 2]} marginTop={[1, 1, 0]}>
              <Checkbox
                label={formatMessage(messages.chooseAllCountries)}
                checked={selectAll}
                onChange={() => {
                  setSelectAll(!selectAll)
                  if (!selectAll) {
                    setSelectedCountries(countries)
                  } else {
                    setSelectedCountries([])
                  }
                }}
              />
            </Box>
          </Box>
          <Box marginY={3} className={styles.countryCheckboxContainer}>
            {countries
              .filter((country) =>
                country.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((country, index) => (
                <Box key={index}>
                  <Checkbox
                    large
                    backgroundColor="blue"
                    value={country.code}
                    checked={selectedCountries.includes(country)}
                    onChange={() => {
                      if (selectedCountries.includes(country)) {
                        setSelectedCountries(
                          selectedCountries.filter((c) => c !== country),
                        )
                      } else {
                        setSelectedCountries([...selectedCountries, country])
                      }
                    }}
                    label={country.name}
                  />
                </Box>
              ))}
          </Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={[0, 0, 3]}
            flexWrap="nowrap"
            columnGap={2}
          >
            <Box className={styles.forwardButton} marginBottom={[1, 1, 0]}>
              <Button
                fluid
                variant="ghost"
                size="small"
                onClick={() => navigate(-1)}
                preTextIcon="arrowBack"
              >
                {formatMessage(messages.cancel)}
              </Button>
            </Box>
            <Box className={styles.forwardButton}>
              <Button
                fluid
                size="small"
                disabled={selectedCountries.length === 0}
                onClick={() => {
                  selectedCountries.length > 0 &&
                    setFormState?.({
                      countries: selectedCountries,
                      dates:
                        formState?.dates.validFrom && formState?.dates.validTo
                          ? {
                              validFrom: formState.dates.validFrom,
                              validTo: formState.dates.validTo,
                            }
                          : {
                              validFrom: null,
                              validTo: null,
                            },
                    })
                  onClick()
                }}
              >
                {formatMessage(messages.forward)}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default Countries
