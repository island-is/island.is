import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  DatePicker,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { translation as translationStrings } from './translation.strings'
interface InputState {
  startDate: Date
  endDate: Date
  employerCount: number
}
interface Results {
  daysDifferenceWithoutWeekend: number
  totalCount: number
}

const VerAnnouncementCalculator = () => {
  const { formatMessage } = useIntl()
  const [inputState, setInputState] = useState<InputState>({
    startDate: new Date(),
    endDate: new Date(),
    employerCount: 0,
  })
  const [results, setResults] = useState<Results | null>(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const updateInputState = (key: keyof InputState, value: Date | number) => {
    setResults(null)
    setButtonDisabled(false)
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const canSubmit = useMemo(() => {
    return (
      inputState.startDate && inputState.endDate && inputState.employerCount > 0
    )
  }, [inputState])

  const calculateResults = (
    startDate: Date,
    endDate: Date,
    employerCount: number,
  ): Results => {
    let daysDifferenceWithoutWeekend = 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    while (start <= end) {
      const dayOfWeek = start.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysDifferenceWithoutWeekend++
      }
      start.setDate(start.getDate() + 1)
    }

    const resultNumber = daysDifferenceWithoutWeekend * employerCount

    return {
      daysDifferenceWithoutWeekend,
      totalCount: resultNumber,
    }
  }

  const calculate = () => {
    setButtonDisabled(true)
    const calculatedResults = calculateResults(
      inputState.startDate,
      inputState.endDate,
      inputState.employerCount,
    )
    setResults(calculatedResults)
  }

  return (
    <Box>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        marginBottom={5}
      >
        <Stack space={5}>
          <Box>
            <DatePicker
              id="startDate"
              name="startDate"
              label={formatMessage(translationStrings.startDateLabel)}
              placeholderText={formatMessage(translationStrings.startDateLabel)}
              handleChange={(event) => {
                updateInputState('startDate', event)
              }}
              size="sm"
              required={true}
            />
          </Box>

          <Box>
            <DatePicker
              id="endDate"
              name="endDate"
              label={formatMessage(translationStrings.endDateLabel)}
              placeholderText={formatMessage(translationStrings.endDateLabel)}
              handleChange={(event) => {
                updateInputState('endDate', event)
              }}
              size="sm"
              required={true}
            />
          </Box>

          <Box>
            <Input
              id="employerCount"
              name="employerCount"
              label={formatMessage(translationStrings.countLabel)}
              type="number"
              onChange={(event) => {
                updateInputState(
                  'employerCount',
                  Number(event.target.value) || 0,
                )
              }}
              size="sm"
              required={true}
            />
          </Box>

          <Button onClick={calculate} disabled={!canSubmit || buttonDisabled}>
            {formatMessage(translationStrings.calculate)}
          </Button>
        </Stack>
      </Box>

      {results && (
        <Box
          background="blue100"
          paddingY={[3, 3, 5]}
          paddingX={[3, 3, 3, 3, 12]}
        >
          <Text variant="h3">
            <strong>{formatMessage(translationStrings.results)}</strong>
          </Text>
          <Stack space={3}>
            <Box>
              <Text
                variant="medium"
                fontWeight="light"
                paddingBottom={1}
                paddingTop={2}
              >
                {formatMessage(translationStrings.daysWithoutWeekends)}
                {': '}
                {results.daysDifferenceWithoutWeekend}
              </Text>
            </Box>
            <Box>
              <Text variant="medium" fontWeight="light" paddingBottom={1}>
                {formatMessage(translationStrings.amountOfDaysWork)}
                {': '}
                {results.totalCount}
              </Text>
            </Box>
            <Box>
              <Text variant="medium" paddingBottom={1}>
                <strong>
                  {results?.totalCount && results.totalCount > 500
                    ? formatMessage(translationStrings.needsAnnouncement)
                    : formatMessage(translationStrings.noAnnouncement)}
                </strong>
              </Text>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default VerAnnouncementCalculator
