import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  default as ReactDatePicker,
  registerLocale,
  ReactDatePickerProps,
} from 'react-datepicker'
import { format, getYear } from 'date-fns'
import pl from 'date-fns/locale/pl'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

import Icon from '../Icon/Icon'
import Typography from '../Typography/Typography'

import * as styles from './DatePicker.treat'
import * as coreStyles from './react-datepicker.treat'

type Locale = 'is' | 'pl'
interface DatePickerProps {
  label: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: Locale
  value?: ReactDatePickerProps['value']
  minDate?: ReactDatePickerProps['minDate']
  handleChange?: (date: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholderText,
  locale,
  value,
  minDate,
  handleChange,
  onInputClick,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )
  const className = cn(
    styles.inputContainer,
    styles.inputContainerVariants[datePickerState],
  )

  useEffect(() => {
    if (locale === 'is') {
      registerLocale('is', is)
    } else if (locale === 'pl') {
      registerLocale('pl', pl)
    }
  }, [locale])

  const getLocale = (locale: Locale) => {
    return locale === 'is' ? is : locale === 'pl' ? pl : en
  }

  const CustomInput = ({ value, onClick, placeholderText }) => {
    const valueAsDate = new Date(value)

    return (
      <button className={className} onClick={onClick}>
        <div className={styles.labelAndPlaceholderContainer}>
          <p className={styles.label}>{label}</p>
          <div className={styles.value}>
            {value ? (
              <Typography variant="h3">
                {format(valueAsDate, 'P', {
                  locale: getLocale(locale),
                })}
              </Typography>
            ) : placeholderText ? (
              <Typography as="span" variant="placeholderText" color="dark300">
                {placeholderText}
              </Typography>
            ) : null}
          </div>
        </div>
        <Icon type="calendar" width="32" height="32" />
      </button>
    )
  }

  return (
    <div className={coreStyles.root}>
      <div className={cn(styles.root, 'island-ui-datepicker')}>
        <ReactDatePicker
          selected={startDate}
          locale={locale}
          minDate={minDate}
          showPopperArrow={false}
          popperPlacement="bottom-start"
          popperModifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              escapeWithReference: false,
            },
          }}
          onCalendarOpen={() => setDatePickerState('open')}
          onCalendarClose={() => setDatePickerState('closed')}
          onChange={(date: Date) => {
            setStartDate(date)
            handleChange(date)
          }}
          customInput={
            <CustomInput
              value={value}
              onClick={onInputClick}
              placeholderText={placeholderText}
            />
          }
          renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
            const month = format(date, 'MMMM', { locale: getLocale(locale) })
            const capitalizedMonth = `${month
              .charAt(0)
              .toUpperCase()}${month.slice(1)}`

            return (
              <div className={styles.customHeaderContainer}>
                <button
                  onClick={decreaseMonth}
                  className={styles.decreaseButton}
                >
                  <Icon type="cheveron" width="16" height="16" />
                </button>
                <Typography variant="datepickerHeaderText">
                  {`${capitalizedMonth} ${getYear(date)}`}
                </Typography>
                <button
                  onClick={increaseMonth}
                  className={styles.increaseButton}
                >
                  <Icon type="cheveron" width="16" height="16" />
                </button>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default DatePicker
