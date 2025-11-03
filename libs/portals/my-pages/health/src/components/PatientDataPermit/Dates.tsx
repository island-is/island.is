import { Box, Button, DatePicker, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, FC, SetStateAction } from 'react'
import { messages } from '../../lib/messages'
import { addMonths, addYears, today } from '../../utils/dates'
import { PermitInput } from '../../utils/types'
import * as styles from './PatientDataPermit.css'
interface DatesProps {
  onClick: () => void
  goBack: () => void
  formState?: PermitInput
  setFormState: Dispatch<SetStateAction<PermitInput | undefined>>
}

const Dates: FC<DatesProps> = ({
  onClick,
  goBack,
  formState,
  setFormState,
}) => {
  const { formatMessage } = useLocale()
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

      <Box width="touchable" style={{ width: '320px' }} marginBottom={3}>
        <DatePicker
          backgroundColor="blue"
          range
          selectedRange={{
            startDate: formState?.dates.validFrom
              ? formState.dates.validFrom
              : null,
            endDate: formState?.dates.validTo ? formState.dates.validTo : null,
          }}
          minDate={today}
          minYear={today.getFullYear()}
          maxDate={addYears(today, 3)}
          maxYear={addYears(today, 3).getFullYear()}
          highlightWeekends
          displaySelectInput
          ranges={[
            {
              startDate: today,
              endDate: addMonths(today, 6),
              label: formatMessage(messages.sixMonths),
            },
            {
              startDate: today,
              endDate: addYears(today, 1),
              label: formatMessage(messages.oneYear),
            },
            {
              startDate: today,
              endDate: addYears(today, 2),
              label: formatMessage(messages.twoYears),
            },
            {
              startDate: today,
              endDate: addYears(today, 3),
              label: formatMessage(messages.threeYears),
            },
          ]}
          handleChange={(startDate, endDate) => {
            startDate &&
              endDate &&
              setFormState({
                ...formState,
                countries: formState?.countries ?? [],
                dates: {
                  validFrom: startDate,
                  validTo: endDate,
                },
              })
          }}
          label={formatMessage(messages.period)}
          placeholderText={formatMessage(messages.choosePeriod)}
          size="xs"
        />
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
            disabled={formState?.dates.validTo === null}
            onClick={onClick}
          >
            {formatMessage(messages.forward)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Dates
