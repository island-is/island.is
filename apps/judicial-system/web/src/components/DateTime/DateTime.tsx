import React, { useEffect, useState } from 'react'
import { DatePicker, Input } from '@island.is/island-ui/core'
import { TimeInputField, BlueBox } from '../../components'
import * as styles from './DateTime.css'

import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  name: string
  datepickerLabel?: string
  datepickerPlaceholder?: string
  timeLabel?: string
  minDate?: Date
  maxDate?: Date
  selectedDate?: Date | string
  disabled?: boolean
  required?: boolean
  blueBox?: boolean
  locked?: boolean
  backgroundColor?: 'blue' | 'white'
  size?: 'sm' | 'md'
  ignoreTime?: boolean
  onChange: (date: Date | undefined, valid: boolean) => void
}

const DateTime: React.FC<Props> = (props) => {
  const {
    name,
    datepickerLabel = 'Veldu dagsetningu',
    datepickerPlaceholder = 'Veldu dagsetningu',
    minDate,
    maxDate,
    selectedDate,
    timeLabel = 'Tímasetning (kk:mm)',
    disabled,
    required = false,
    blueBox = true,
    locked = false,
    backgroundColor = 'white',
    size = 'md',
    ignoreTime = false,
    onChange,
  } = props

  const getTimeFromDate = (date: Date | undefined): string =>
    date
      ? `${date
          .getHours()
          .toString()
          .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      : ''

  const date = (d: Date | string | undefined) => {
    return d ? new Date(d) : undefined
  }

  const [currentDate, setCurrentDate] = useState(date(selectedDate))
  const [currentTime, setCurrentTime] = useState(
    ignoreTime ? '00:00' : getTimeFromDate(date(selectedDate)),
  )

  const [datepickerErrorMessage, setDatepickerErrorMessage] = useState<string>()
  const [timeErrorMessage, setTimeErrorMessage] = useState<string>()

  useEffect(() => {
    const time = getTimeFromDate(date(selectedDate))

    setCurrentDate(date(selectedDate))

    if (!ignoreTime) {
      setCurrentTime(time)
    }
  }, [ignoreTime, selectedDate])

  const isValidDateTime = (
    date: Date | undefined,
    time: string | undefined,
    required: boolean,
  ) => {
    const validations: Validation[] = ['empty', 'time-format']

    const timeIsValid = validate([[time, validations]]).isValid

    return (
      (required && date !== undefined && timeIsValid) ||
      (required === false && date === undefined) ||
      (date !== undefined && timeIsValid)
    )
  }

  const onCalendarClose = (date: Date | null) => {
    if (date === null && required) {
      return
    }

    const correctTime = date === null ? undefined : date

    setCurrentDate(correctTime)

    if (required && correctTime === undefined) {
      setDatepickerErrorMessage('Reitur má ekki vera tómur')
    } else {
      setDatepickerErrorMessage(undefined)
    }

    sendToParent(correctTime, currentTime)
  }

  const onTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value

    setCurrentTime(time)

    const validations: Validation[] = ['empty', 'time-format']

    const timeValidation = validate([[time, validations]])

    if (timeValidation.isValid) {
      setTimeErrorMessage(undefined)
    }

    sendToParent(currentDate, time)
  }

  const onTimeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const time = event.target.value

    const validations: Validation[] = ['empty', 'time-format']

    const timeValidation = validate([[time, validations]])

    if (!timeValidation.isValid) {
      setTimeErrorMessage(timeValidation.errorMessage)
    }
  }

  const sendToParent = (date: Date | undefined, time: string | undefined) => {
    const isValid = isValidDateTime(date, time, required)

    if (isValid && date && time) {
      let dateToSend = new Date(date.getTime())

      const timeParts = time.split(':')

      const hours = parseInt(timeParts[0])
      const minutes = parseInt(timeParts[1])

      dateToSend.setHours(hours, minutes)

      // Make sure the time component does not make the date larger than the max date.
      if (maxDate && dateToSend > maxDate) {
        dateToSend = maxDate
        setCurrentTime(getTimeFromDate(maxDate))
      }

      onChange(dateToSend, isValid)
    } else {
      onChange(undefined, isValid)
    }
  }

  const renderDateTime = () => {
    return (
      <div
        data-testid="date-time"
        className={ignoreTime ? undefined : styles.dateTimeContainer}
      >
        <DatePicker
          id={name}
          label={datepickerLabel}
          placeholderText={datepickerPlaceholder}
          locale="is"
          errorMessage={datepickerErrorMessage}
          hasError={datepickerErrorMessage !== undefined}
          icon={locked ? 'lockClosed' : undefined}
          minDate={minDate}
          maxDate={maxDate}
          selected={selectedDate ? new Date(selectedDate) : undefined}
          disabled={disabled || locked}
          handleCloseCalendar={onCalendarClose}
          required={required}
          backgroundColor={backgroundColor}
          size={size}
        />
        {!ignoreTime && (
          <TimeInputField
            disabled={disabled || locked || currentDate === undefined}
            onChange={onTimeChange}
            onBlur={onTimeBlur}
            value={currentTime}
          >
            <Input
              data-testid={`${name}-time`}
              name={`${name}-time`}
              label={timeLabel}
              placeholder="Veldu tíma"
              errorMessage={timeErrorMessage}
              hasError={timeErrorMessage !== undefined}
              icon={locked ? 'lockClosed' : undefined}
              iconType="outline"
              required={required}
              backgroundColor={backgroundColor}
              size={size}
              autoComplete="off"
            />
          </TimeInputField>
        )}
      </div>
    )
  }

  return blueBox ? <BlueBox>{renderDateTime()}</BlueBox> : renderDateTime()
}

export default DateTime
