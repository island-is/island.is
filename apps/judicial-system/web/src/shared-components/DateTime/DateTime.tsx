import React from 'react'
import { Box, DatePicker, Input, Text } from '@island.is/island-ui/core'
import * as styles from './DateTime.treat'
import { Icon } from 'libs/island-ui/core/src/lib/IconRC/iconMap'
import { TimeInputField, BlueBox } from '../../shared-components'

interface Props {
  datepickerId: string
  datepickerErrorMessage?: string
  datepickerIcon?: Icon
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
  timeErrorMessage?: string
  timeDefaultValue?: string
  timeIcon?: Icon
  timeIsRequired?: boolean
  disabledTime?: boolean
}

const DateTime: React.FC<Props> = (props) => {
  const {
    datepickerId,
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
    timeErrorMessage,
    timeDefaultValue,
    timeIcon,
    timeIsRequired,
    disabledTime,
  } = props

  return (
    <BlueBox>
      <div data-testid="date-time" className={styles.dateTimeContainer}>
        <DatePicker
          id={datepickerId}
          label="Veldu dagsetningu"
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
        />
        <TimeInputField
          disabled={disabledTime}
          onChange={timeOnChange}
          onBlur={timeOnBlur}
        >
          <Input
            data-testid={timeName}
            name={timeName}
            label="Ósk um tíma (kk:mm)"
            placeholder="Veldu tíma"
            errorMessage={timeErrorMessage}
            hasError={timeErrorMessage !== ''}
            defaultValue={timeDefaultValue}
            icon={timeIcon}
            iconType="outline"
            required={timeIsRequired}
          />
        </TimeInputField>
      </div>
    </BlueBox>
  )
}

export default DateTime
