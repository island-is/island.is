import React from 'react'
import { DatePicker, Input } from '@island.is/island-ui/core'
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
  timeRef?: React.RefObject<HTMLInputElement>
  disabledTime?: boolean

  blueBox?: boolean
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
    timeRef,
    disabledTime,
    blueBox = true,
  } = props

  const renderDateTime = () => {
    return (
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
            ref={timeRef}
            required={timeIsRequired}
          />
        </TimeInputField>
      </div>
    )
  }

  return blueBox ? <BlueBox>{renderDateTime()}</BlueBox> : renderDateTime()
}

export default DateTime
