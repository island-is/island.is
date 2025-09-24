import { useCallback, useEffect, useState } from 'react'
import addDays from 'date-fns/addDays'
import { FieldExtensionSDK } from '@contentful/app-sdk'
import {
  Checkbox,
  Datepicker,
  Flex,
  FormControl,
  Text,
  TextInput,
} from '@contentful/f36-components'
import { useSDK } from '@contentful/react-apps-toolkit'

interface TimeDuration {
  startTime?: string
  endTime?: string
  endDate?: string
}

const TimeDurationField = () => {
  const sdk = useSDK<FieldExtensionSDK>()
  const [time, setTime] = useState<TimeDuration>(sdk.field.getValue() ?? {})
  const [startDateIsSameAsEndDate, setStartDateIsSameAsEndDate] = useState(true)
  const [startDateString, setStartDateString] = useState<string | undefined>(
    sdk.entry.fields.startDate.getForLocale(sdk.field.locale)?.getValue(),
  )

  useEffect(() => {
    if (startDateIsSameAsEndDate) {
      sdk.window.startAutoResizer()
      return () => {
        sdk.window.stopAutoResizer()
      }
    }
    sdk.window.stopAutoResizer()
    sdk.window.updateHeight(540)
  }, [sdk.window, startDateIsSameAsEndDate])

  const updateTime = useCallback(
    (field: keyof TimeDuration, value: string) => {
      setTime((prevTime) => {
        const updatedTime = {
          ...prevTime,
          [field]: value,
        }

        if (field === 'startTime' && updatedTime.endTime) {
          const sd = new Date(`2000-01-01T${value}`)
          const ed = new Date(`2000-01-01T${updatedTime.endTime ?? ''}`)
          if (sd >= ed) {
            updatedTime.endTime = ''
          }
        }

        if (field === 'endTime' && updatedTime.startTime) {
          const sd = new Date(`2000-01-01T${updatedTime.startTime ?? ''}`)
          const ed = new Date(`2000-01-01T${value}`)
          if (sd >= ed) {
            updatedTime.startTime = ''
          }
        }

        sdk.field.setValue(updatedTime)
        return updatedTime
      })
    },
    [sdk.field],
  )

  useEffect(() => {
    return sdk.entry.fields.startDate
      .getForLocale(sdk.field.locale)
      .onValueChanged((value) => {
        setStartDateString(value)
        updateTime('endDate', '')
      })
  }, [sdk.entry.fields.startDate, sdk.field.locale, updateTime])

  const startDate = startDateString ? new Date(startDateString) : undefined

  const fromDate = startDate ? addDays(startDate, 1) : undefined

  return (
    <FormControl>
      <Flex gap="spacingS" flexDirection="column" paddingBottom="spacingS">
        <Checkbox
          id="starts-and-ends-on-the-same-day"
          isChecked={startDateIsSameAsEndDate}
          onChange={() => {
            const newStartDateIsSameAsEndDate = !startDateIsSameAsEndDate
            setStartDateIsSameAsEndDate(newStartDateIsSameAsEndDate)
            if (newStartDateIsSameAsEndDate) {
              updateTime('endDate', '')
            }
          }}
        >
          Starts and ends on the same day
        </Checkbox>
      </Flex>
      {startDateIsSameAsEndDate && (
        <>
          <TextInput.Group spacing="spacingS">
            <TextInput
              type="time"
              value={time.startTime}
              style={{ width: '150px' }}
              size="small"
              name="start-time"
              placeholder="Start time"
              onChange={(ev) => {
                updateTime('startTime', ev.target.value)
              }}
            />
            {' - '}
            <TextInput
              type="time"
              value={time.endTime}
              style={{ width: '150px' }}
              size="small"
              name="end-time"
              placeholder="End time"
              onChange={(ev) => {
                updateTime('endTime', ev.target.value)
              }}
            />
          </TextInput.Group>
          <FormControl.HelpText>Ex. 12:00 - 14:00</FormControl.HelpText>
        </>
      )}
      {!startDateIsSameAsEndDate && startDate && (
        <Flex gap="spacingS" flexDirection="column">
          <Flex flexDirection="column">
            <FormControl.Label>Start date</FormControl.Label>
            <Text>
              {startDate.getDate()}.{startDate.getMonth() + 1}.
              {startDate.getFullYear()}
            </Text>
          </Flex>
          <Flex gap="spacingS" flexDirection="column">
            <Flex flexDirection="column">
              <FormControl.Label>Start time</FormControl.Label>
              <TextInput
                type="time"
                value={time.startTime}
                style={{ width: '267px' }}
                size="small"
                name="start-time"
                placeholder="Start time"
                onChange={(ev) => {
                  updateTime('startTime', ev.target.value)
                }}
              />
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <FormControl.Label>End time</FormControl.Label>
            <TextInput
              type="time"
              value={time.endTime}
              style={{ width: '267px' }}
              size="small"
              name="end-time"
              placeholder="End time"
              onChange={(ev) => {
                updateTime('endTime', ev.target.value)
              }}
            />
          </Flex>
          <Flex gap="spacingS" flexDirection="column">
            <Flex flexDirection="column">
              <FormControl.Label>End date</FormControl.Label>
              <Datepicker
                selected={time.endDate ? new Date(time.endDate) : fromDate}
                fromDate={fromDate}
                onSelect={(day) => {
                  updateTime('endDate', day ? day.toISOString() : '')
                }}
                style={{ width: '267px' }}
              />
            </Flex>
          </Flex>
        </Flex>
      )}
      {!startDateIsSameAsEndDate && !startDate && (
        <Text>Please select a start date</Text>
      )}
    </FormControl>
  )
}

export default TimeDurationField
