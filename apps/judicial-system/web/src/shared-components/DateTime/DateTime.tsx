import React from 'react'
import { DatePicker, DatePickerProps, Input } from '@island.is/island-ui/core'
import { TimeInputField, BlueBox } from '../../shared-components'
import * as styles from './DateTime.treat'

interface Props {
  datepickerId: string
  datepickerLabel?: string
  datepickerErrorMessage?: string
  datepickerIcon?: DatePickerProps['icon']
  minDate?: Date
  maxDate?: Date
  selectedDate?: Date | null | undefined
  disabledDate?: boolean
  handleCloseCalander?: ((date: Date | null) => void) | undefined
  dateIsRequired?: boolean

  timeOnChange:
    | ((event: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined
  timeOnBlur: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined
  timeName: string
  timeLabel?: string
  timeErrorMessage?: string
  timeDefaultValue?: string
  timeIcon?: DatePickerProps['icon']
  timeIsRequired?: boolean
  timeRef?: React.RefObject<HTMLInputElement>
  disabledTime?: boolean

  blueBox?: boolean
  backgroundColor?: 'blue' | 'white'
}

const DateTime: React.FC<Props> = (props) => {
  const {
    datepickerId,
    datepickerLabel = 'Veldu dagsetningu',
    datepickerErrorMessage,
    datepickerIcon,
    minDate,
    maxDate,
    selectedDate,
    disabledDate,
    handleCloseCalander,
    dateIsRequired,
    timeOnChange,
    timeOnBlur,
    timeName,
    timeLabel = 'Tímasetning (kk:mm)',
    timeErrorMessage,
    timeDefaultValue,
    timeIcon,
    timeIsRequired,
    timeRef,
    disabledTime,
    blueBox = true,
    backgroundColor,
  } = props

  const renderDateTime = () => {
    return (
      <div data-testid="date-time" className={styles.dateTimeContainer}>
        <DatePicker
          id={datepickerId}
          label={datepickerLabel}
          placeholderText="Veldu dagsetningu"
          locale="is"
          errorMessage={datepickerErrorMessage}
          hasError={datepickerErrorMessage !== ''}
          icon={datepickerIcon}
          minDate={minDate}
          maxDate={maxDate}
          selected={selectedDate}
          disabled={disabledDate}
          handleCloseCalendar={handleCloseCalander}
          required={dateIsRequired}
          backgroundColor={backgroundColor}
        />
        <TimeInputField
          disabled={disabledTime}
          onChange={timeOnChange}
          onBlur={timeOnBlur}
        >
          <Input
            data-testid={timeName}
            name={timeName}
            label={timeLabel}
            placeholder="Veldu tíma"
            errorMessage={timeErrorMessage}
            hasError={timeErrorMessage !== ''}
            defaultValue={timeDefaultValue}
            icon={timeIcon}
            iconType="outline"
            ref={timeRef}
            required={timeIsRequired}
            backgroundColor={backgroundColor}
          />
        </TimeInputField>
      </div>
    )
  }

  return blueBox ? <BlueBox>{renderDateTime()}</BlueBox> : renderDateTime()
}

export default DateTime
