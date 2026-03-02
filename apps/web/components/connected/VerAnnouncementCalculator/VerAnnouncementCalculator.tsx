import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'

import { translation as translationStrings } from './translation.strings'

interface InputState {
  startDate: string
  endDate: string
  employerCount: number
}
interface Results {
  daysDifferenceWithoutWeekend: number
  totalCount: number
}

const VerAnnouncementCalculator = () => {
  const { formatMessage } = useIntl()
  const [inputState, setInputState] = useState<InputState>({
    startDate: '',
    endDate: '',
    employerCount: 0,
  })
  const [results, setResults] = useState<Results | null>(null)

  const updateInputState = (key: keyof InputState, value: string | number) => {
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const { control, getValues } = useForm()

  const canSubmit = useMemo(() => {
    return (
      inputState.startDate.length > 0 &&
      inputState.endDate.length > 0 &&
      inputState.employerCount > 0
    )
  }, [inputState])

  const calculateResults = (
    startDate: string,
    endDate: string,
    employerCount: number,
  ): Results => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    let daysDifferenceWithoutWeekend = 0
    const current = new Date(start)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysDifferenceWithoutWeekend++
      }
      current.setDate(current.getDate() + 1)
    }

    const resultNumber = daysDifferenceWithoutWeekend * employerCount

    return {
      daysDifferenceWithoutWeekend,
      totalCount: resultNumber,
    }
  }

  const calculate = () => {
    const values = getValues() as InputState
    const calculatedResults = calculateResults(
      values.startDate,
      values.endDate,
      values.employerCount,
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
            <InputController
              id="startDate"
              control={control}
              name="startDate"
              label={formatMessage(translationStrings.startDateLabel)}
              type="date"
              onChange={(event) => {
                updateInputState('startDate', event.target.value)
              }}
              size="sm"
              required={true}
            />
          </Box>

          <Box>
            <InputController
              id="endDate"
              control={control}
              name="endDate"
              label={formatMessage(translationStrings.endDateLabel)}
              type="date"
              onChange={(event) => {
                updateInputState('endDate', event.target.value)
              }}
              size="sm"
              required={true}
            />
          </Box>

          <Box>
            <InputController
              id="employerCount"
              control={control}
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

          <Button onClick={calculate} disabled={!canSubmit}>
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
                variant="large"
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
              <Text variant="large" fontWeight="light" paddingBottom={1}>
                {formatMessage(translationStrings.amountOfDaysWork)}
                {': '}
                {results.totalCount}
              </Text>
            </Box>
            <Box>
              <Text variant="large" fontWeight="light" paddingBottom={1}>
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
