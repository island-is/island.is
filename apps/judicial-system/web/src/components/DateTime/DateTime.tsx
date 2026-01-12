import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { InputMask } from '@react-input/mask'

import { DatePicker, Input } from '@island.is/island-ui/core'
import { DATE_PICKER_TIME } from '@island.is/judicial-system/consts'
import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'

import { BlueBox } from '../../components'
import { strings } from './DateTime.strings'
import * as styles from './DateTime.css'

interface Props {
  name: string
  datepickerLabel?: string
  datepickerPlaceholder?: string
  timeLabel?: string
  minDate?: Date
  maxDate?: Date
  selectedDate?: Date | string | null
  disabled?: boolean
  required?: boolean
  blueBox?: boolean
  locked?: boolean
  backgroundColor?: 'blue' | 'white'
  size?: 'sm' | 'md'
  dateOnly?: boolean
  timeOnly?: boolean
  defaultTime?: string
  onChange: (date: Date | undefined, valid: boolean) => void
}

const DateTime: FC<Props> = ({
  name,
  datepickerLabel = 'Veldu dagsetningu',
  datepickerPlaceholder = 'Veldu dagsetningu',
  minDate,
  maxDate,
  selectedDate,
  timeLabel,
  disabled,
  required = false,
  blueBox = true,
  locked = false,
  backgroundColor = 'white',
  size = 'md',
  dateOnly = false,
  timeOnly = false,
  defaultTime = '',
  onChange,
}) => {
  const { formatMessage } = useIntl()

  const getTimeFromDate = (date: Date | undefined): string =>
    date
      ? `${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      : ''

  const date = (d: Date | string | undefined | null) => {
    return d ? new Date(d) : undefined
  }

  const [currentDate, setCurrentDate] = useState(date(selectedDate))
  const [currentTime, setCurrentTime] = useState(
    dateOnly ? '00:00' : getTimeFromDate(date(selectedDate)),
  )

  const [datepickerErrorMessage, setDatepickerErrorMessage] = useState<string>()
  const [timeErrorMessage, setTimeErrorMessage] = useState<string>()

  useEffect(() => {
    const time = getTimeFromDate(date(selectedDate))

    setCurrentDate(date(selectedDate))

    if (!dateOnly) {
      setCurrentTime(time)
    }
  }, [dateOnly, selectedDate])

  const isValidDateTime = (
    date: Date | undefined,
    time: string | undefined,
    required: boolean,
  ) => {
    const validations: Validation[] = ['empty', 'time-format']

    const timeIsValid = validate([[time, validations]]).isValid

    return (
      (required && date !== undefined && timeIsValid) ||
      (!required && date === undefined) ||
      (date !== undefined && timeIsValid)
    )
  }

  const onCalendarClose = (date: Date | null) => {
    if (date === null && required) {
      return
    }

    const newDate = date === null ? undefined : date

    setCurrentDate(newDate)

    if (required && newDate === undefined) {
      setDatepickerErrorMessage('Reitur má ekki vera tómur')
    } else {
      setDatepickerErrorMessage(undefined)
    }

    sendToParent(
      newDate,
      !currentDate && defaultTime ? defaultTime : currentTime,
    )
  }

  const onTimeChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newTime = event.target.value

    setCurrentTime(newTime)

    const validations: Validation[] = ['empty', 'time-format']

    const timeValidation = validate([[newTime, validations]])

    if (timeValidation.isValid) {
      setTimeErrorMessage(undefined)
    }

    sendToParent(currentDate, newTime)
  }

  const onTimeBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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
        className={dateOnly || timeOnly ? undefined : styles.dateTimeContainer}
      >
        {!timeOnly && (
          <DatePicker
            id={name}
            label={datepickerLabel}
            placeholderText={datepickerPlaceholder}
            locale="is"
            errorMessage={datepickerErrorMessage}
            hasError={datepickerErrorMessage !== undefined}
            icon={locked ? { name: 'lockClosed', type: 'outline' } : undefined}
            minDate={minDate}
            maxDate={maxDate}
            selected={currentDate ? new Date(currentDate) : undefined}
            disabled={disabled || locked}
            handleCloseCalendar={onCalendarClose}
            required={required}
            backgroundColor={backgroundColor}
            size={size}
          />
        )}
        {(!dateOnly || timeOnly) && (
          <InputMask
            component={Input}
            mask={DATE_PICKER_TIME}
            showMask
            replacement={{ ' ': /\d/ }}
            disabled={disabled || locked || currentDate === undefined}
            onChange={onTimeChange}
            onBlur={onTimeBlur}
            value={currentTime}
            data-testid={`${name}-time`}
            name={`${name}-time`}
            label={timeLabel ?? formatMessage(strings.timeLabel)}
            placeholder={formatMessage(strings.timePlaceholder)}
            errorMessage={timeErrorMessage}
            hasError={timeErrorMessage !== undefined}
            icon={locked ? { name: 'lockClosed', type: 'outline' } : undefined}
            required={required}
            backgroundColor={backgroundColor}
            size={size}
            autoComplete="off"
          />
        )}
      </div>
    )
  }

  return blueBox ? <BlueBox>{renderDateTime()}</BlueBox> : renderDateTime()
}

export default DateTime
