import {
  HealthDirectoratePatientDataApprovalCountry,
  HealthDirectoratePatientDataPermitInput,
} from '@island.is/api/schema'
import {
  Box,
  Button,
  Checkbox,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { messages } from '../../lib/messages'
import * as styles from './PatientDataPermit.css'
import { useHealthDirectoratePatientDataPermitCountriesQuery } from './SecondStep.generated'
import { Problem } from '@island.is/react-spa/shared'
interface SecondStepProps {
  onClick: () => void
  goBack: () => void
  formState?: HealthDirectoratePatientDataPermitInput
  setFormState: Dispatch<
    SetStateAction<HealthDirectoratePatientDataPermitInput | undefined>
  >
}

const SecondStep: FC<SecondStepProps> = ({
  onClick,
  goBack,
  setFormState,
  formState,
}) => {
  const { formatMessage, lang } = useLocale()
  const [selectedCountries, setSelectedCountries] = useState<
    Omit<HealthDirectoratePatientDataApprovalCountry, 'id'>[]
  >([])
  const [selectAll, setSelectAll] = useState<boolean>(false)

  const { data, error, loading } =
    useHealthDirectoratePatientDataPermitCountriesQuery({
      variables: {
        locale: lang,
      },
    })

  const countries = data?.healthDirectoratePatientDataPermitCountries.data || []

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '2', second: '3' })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.whatCountriesShouldPermitApply)}
      </Text>
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
        <Problem
          noBorder={false}
          title={formatMessage(messages.countriesError)}
        ></Problem>
      )}

      {countries.length > 0 && (
        <>
          <Box>
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
          <Box marginTop={3} className={styles.countryCheckboxContainer}>
            {countries.map((country, index) => (
              <Box key={index} paddingRight={[0, 0, 3]} paddingBottom={3}>
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
            flexWrap="wrap"
          >
            <Box className={styles.forwardButton} marginBottom={[1, 1, 0]}>
              <Button
                fluid
                variant="ghost"
                size="small"
                onClick={goBack}
                preTextIcon="arrowBack"
              >
                {formatMessage(messages.goBack)}
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
                      codes: formState?.codes ?? [],
                      validFrom:
                        formState?.validFrom ?? new Date().toISOString(),
                      validTo: formState?.validTo ?? new Date().toISOString(),
                      countryCodes: selectedCountries.map((x) => x.code),
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

export default SecondStep
