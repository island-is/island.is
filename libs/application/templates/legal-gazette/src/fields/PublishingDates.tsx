import {
  Box,
  Button,
  DatePicker,
  Inline,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { useEffect, useState } from 'react'
import { LGFieldBaseProps } from '../lib/types'
import { getValueViaPath } from '@island.is/application/core'
import { MAX_DATE_REPEATER_LENGTH } from '../lib/constants'
import { useFormContext } from 'react-hook-form'
import { getWeekendDates } from '../lib/utils'
import addYears from 'date-fns/addYears'
import addDays from 'date-fns/addDays'

export const PublishingDates = ({ application }: LGFieldBaseProps) => {
  const { formatMessage, formatDateFns } = useLocale()
  const { setValue } = useFormContext()

  const now = new Date()
  const defaultDate = addDays(now, 14)
  const minDate =
    now.getHours() < 12 ? now : new Date(now.setDate(now.getDate() + 1))

  const dateAnswers = getValueViaPath<string[]>(
    application.answers,
    'publishing.dates',
    [defaultDate.toISOString()],
  ) as string[]
  const [withDate, setWithDate] = useState(dateAnswers.length > 0)

  const [dateValues, setDateValues] = useState<string[]>(dateAnswers)

  // first time the component is rendered, set the default date
  useEffect(() => {
    setValue('publishing.dates', dateValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddDate = () => {
    if (dateValues.length < MAX_DATE_REPEATER_LENGTH) {
      setDateValues((prev) => [...prev, defaultDate.toISOString()])
    }
  }

  const handleRemoveDate = (index: number) => {
    const newDates = [...dateValues]
    newDates.splice(index, 1)
    setDateValues(newDates)
    setValue('publishing.dates', newDates)
  }

  const handleDateChange = (index: number, date: Date | null) => {
    if (!date) return
    const newDates = [...dateValues]
    newDates[index] = date.toISOString()
    setDateValues(newDates)
    setValue('publishing.dates', newDates)
  }

  return (
    <Stack space={3}>
      <Stack space={2}>
        <Text variant="h4">
          {formatMessage(m.draft.sections.publishing.datePickerType)}
        </Text>
        <RadioButton
          checked={!withDate}
          onChange={() => {
            setDateValues([])
            setValue('publishing.dates', [])
            setWithDate(false)
          }}
          label={formatMessage(m.draft.sections.publishing.radioNoSpecificDate)}
        />
        <RadioButton
          checked={withDate}
          onChange={() => {
            if (!dateValues.length) {
              setDateValues([defaultDate.toISOString()])
              setValue('publishing.dates', [defaultDate.toISOString()])
            }
            setWithDate(true)
          }}
          label={formatMessage(m.draft.sections.publishing.radioSpecificDate)}
        />

        {withDate && (
          <Box padding={2} border="standard" borderRadius="large">
            <Text variant="h5" marginBottom={2}>
              {formatMessage(m.draft.sections.publishing.dateRepeaterTitle)}
            </Text>
            <Stack space={2} dividers>
              {dateValues.map((date, index) => {
                return (
                  <Inline
                    justifyContent={['flexStart', 'spaceBetween']}
                    alignY="center"
                    space={2}
                    key={index}
                  >
                    <DatePicker
                      required={index === 0}
                      size="sm"
                      locale="is"
                      backgroundColor="blue"
                      placeholderText={formatDateFns(defaultDate, 'dd.MM.yyyy')}
                      selected={date ? new Date(date) : null}
                      label={`${formatMessage(
                        m.draft.sections.publishing.datePickerLabel,
                      )}${index > 0 ? ` ${index + 1}` : ''}`}
                      minDate={minDate}
                      handleChange={(date) => handleDateChange(index, date)}
                      excludeDates={getWeekendDates(
                        minDate,
                        addYears(minDate, 1),
                      )}
                    />
                    {index > 0 && (
                      <Button
                        size="small"
                        icon="trash"
                        iconType="outline"
                        colorScheme="destructive"
                        variant="text"
                        onClick={() => handleRemoveDate(index)}
                      >
                        {formatMessage(
                          m.draft.sections.publishing.dateRepeaterRemoveButton,
                        )}
                      </Button>
                    )}
                  </Inline>
                )
              })}
              <Inline align="right">
                <Button
                  size="small"
                  variant="ghost"
                  onClick={handleAddDate}
                  disabled={dateValues.length >= MAX_DATE_REPEATER_LENGTH}
                >
                  {formatMessage(
                    m.draft.sections.publishing.dateRepeaterAddButton,
                  )}
                </Button>
              </Inline>
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

export default PublishingDates
