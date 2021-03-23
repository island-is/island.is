import React, { useState } from 'react'
import { DatePicker, DatePickerProps, Input } from '@island.is/island-ui/core'
import { TimeInputField, BlueBox } from '../../shared-components'
import * as styles from './NewDateTime.treat'

import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'
import { getTimeFromDate } from '@island.is/judicial-system-web/src/utils/formHelper'

interface Props {
  name: string
  datepickerLabel?: string
  timeLabel?: string
  minDate?: Date
  maxDate?: Date
  selectedDate?: string
  disabled?: boolean
  required?: boolean
  blueBox?: boolean
  locked?: boolean
  backgroundColor?: 'blue' | 'white'
  onChange: (date: Date | undefined, valid: boolean) => void
}

const NewDateTime: React.FC<Props> = (props) => {
  const {
    name,
    datepickerLabel = 'Veldu dagsetningu',
    minDate,
    maxDate,
    selectedDate,
    timeLabel = 'Tímasetning (kk:mm)',
    disabled,
    required = false,
    blueBox = true,
    locked = false,
    backgroundColor = 'white',
    onChange,
  } = props

  const [currentDate, setCurrentDate] = useState<Date | undefined>(
    new Date(selectedDate || ''),
  )
  const [currentTime, setCurrentTime] = useState<string>(
    getTimeFromDate(selectedDate) || '',
  )

  const [datepickerErrorMessage, setDatepickerErrorMessage] = useState<string>()
  const [timeErrorMessage, setTimeErrorMessage] = useState<string>()

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

    const error = validations
      .map((v) => validate(time, v))
      .find((v) => v.isValid === false)

    if (error === undefined) {
      setTimeErrorMessage(undefined)
    }

    sendToParent(currentDate, time)
  }

  const onTimeBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const time = event.target.value

    const validations: Validation[] = ['empty', 'time-format']

    const error = validations
      .map((v) => validate(time, v))
      .find((v) => v.isValid === false)

    if (error) {
      setTimeErrorMessage(error.errorMessage)
    }
  }

  const sendToParent = (date: Date | undefined, time: string) => {
    const validations: Validation[] = ['empty', 'time-format']

    const timeError = validations.find(
      (v) => validate(time, v).isValid === false,
    )

    const isValid =
      ((required && date !== undefined) || required === false) &&
      timeError === undefined

    if (isValid && date) {
      const dateToSend = new Date(date.getTime())

      const timeParts = time.split(':')

      const hours = parseInt(timeParts[0])
      const minutes = parseInt(timeParts[1])

      dateToSend.setHours(hours, minutes)

      onChange(dateToSend, isValid)
    } else {
      onChange(undefined, isValid)
    }
  }

  const renderDateTime = () => {
    return (
      <div data-testid="date-time" className={styles.dateTimeContainer}>
        <DatePicker
          id={name}
          label={datepickerLabel}
          placeholderText="Veldu dagsetningu"
          locale="is"
          errorMessage={datepickerErrorMessage}
          hasError={datepickerErrorMessage != undefined}
          icon={locked ? 'lockClosed' : undefined}
          minDate={minDate}
          maxDate={maxDate}
          selected={selectedDate ? new Date(selectedDate) : undefined}
          disabled={disabled || locked}
          handleCloseCalendar={onCalendarClose}
          required={required}
          backgroundColor={backgroundColor}
        />
        <TimeInputField
          disabled={disabled || locked || currentDate == undefined}
          onChange={onTimeChange}
          onBlur={onTimeBlur}
        >
          <Input
            data-testid={`${name}-time`}
            name={name}
            label={timeLabel}
            placeholder="Veldu tíma"
            errorMessage={timeErrorMessage}
            hasError={timeErrorMessage !== undefined}
            defaultValue={getTimeFromDate(selectedDate)}
            icon={locked ? 'lockClosed' : undefined}
            iconType="outline"
            required={required}
            backgroundColor={backgroundColor}
          />
        </TimeInputField>
      </div>
    )
  }

  return blueBox ? <BlueBox>{renderDateTime()}</BlueBox> : renderDateTime()
}

export default NewDateTime
