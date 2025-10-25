import { HealthDirectoratePatientDataPermitInput } from '@island.is/api/schema'
import {
  Box,
  Button,
  DatePicker,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { messages } from '../../lib/messages'
import { addMonths, addYears, today } from '../../utils/dates'
import * as styles from './PatientDataPermit.css'
import { m } from '@island.is/portals/my-pages/core'
interface SecondStepProps {
  onClick: () => void
  goBack: () => void
  formState?: HealthDirectoratePatientDataPermitInput
  setFormState: Dispatch<
    SetStateAction<HealthDirectoratePatientDataPermitInput | undefined>
  >
}

// Date step
const SecondStep: FC<SecondStepProps> = ({
  onClick,
  goBack,
  formState,
  setFormState,
}) => {
  const { formatMessage } = useLocale()
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Date | null | undefined
    endDate: Date | null | undefined
  }>({ startDate: null, endDate: null })

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: '2', second: '3' })}
      </Text>
      <Text variant="h5" marginY={1}>
        {formatMessage(messages.howLongShouldPermitApply)}
      </Text>
      <Text variant="default" marginBottom={3}>
        {formatMessage(messages.howLongDescription)}
      </Text>

      <Inline space={3} flexWrap="wrap">
        <Box width="touchable" style={{ width: '320px' }} marginBottom={3}>
          <DatePicker
            backgroundColor="blue"
            minDate={today}
            minYear={today.getFullYear()}
            maxDate={addYears(today, 3)}
            maxYear={addYears(today, 3).getFullYear()}
            selected={selectedRange.startDate}
            handleChange={(startDate) => {
              setSelectedRange({ startDate, endDate: selectedRange.endDate })
            }}
            label={formatMessage(messages.period)}
            placeholderText={formatMessage(m.dateFrom)}
            size="xs"
          />
        </Box>
        <Box width="touchable" style={{ width: '320px' }} marginBottom={3}>
          <DatePicker
            backgroundColor="blue"
            minDate={selectedRange.startDate}
            minYear={today.getFullYear()}
            maxDate={addYears(today, 3)}
            maxYear={addYears(today, 3).getFullYear()}
            selected={selectedRange.endDate}
            handleChange={(endDate) => {
              setSelectedRange({ startDate: selectedRange.startDate, endDate })
            }}
            label={formatMessage(messages.period)}
            placeholderText={formatMessage(m.dateTo)}
            size="xs"
          />
        </Box>
      </Inline>
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
            disabled={selectedRange.endDate === null}
            onClick={() => {
              if (selectedRange.startDate && selectedRange.endDate) {
                setFormState?.({
                  codes: formState?.codes ?? [],
                  countryCodes: formState?.countryCodes ?? [],
                  validFrom: selectedRange.startDate?.toISOString(),
                  validTo: selectedRange.endDate?.toISOString(),
                })
                onClick()
              }
            }}
          >
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SecondStep
