import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../lib/messages'
import * as styles from './PatientDataPermit.css'
import { europeanCountriesIs } from './mockData'
interface SecondStepProps {
  onClick: () => void
  goBack: () => void
}

const SecondStep: React.FC<SecondStepProps> = ({ onClick, goBack }) => {
  const { formatMessage } = useLocale()
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([])
  const [selectAll, setSelectAll] = React.useState<boolean>(false)

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '2', second: '3' })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.whatCountriesShouldPermitApply)}
      </Text>

      <Box>
        <Checkbox
          label={formatMessage(messages.chooseAllCountries)}
          checked={selectAll}
          onChange={() => {
            setSelectAll(!selectAll)
            if (!selectAll) {
              setSelectedCountries(europeanCountriesIs)
            } else {
              setSelectedCountries([])
            }
          }}
        />
      </Box>
      <Box marginTop={3} className={styles.countryCheckboxContainer}>
        {europeanCountriesIs.map((country, index) => (
          <Box key={index} paddingRight={[0, 0, 3]} paddingBottom={3}>
            <Checkbox
              large
              backgroundColor="blue"
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
              label={country}
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
            onClick={onClick}
          >
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SecondStep
