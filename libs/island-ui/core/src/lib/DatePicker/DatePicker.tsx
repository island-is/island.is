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
  selected?: ReactDatePickerProps['selected']
  hasError?: boolean
  errorMessage?: string
  handleChange?: (date: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
  handleCloseCalander?: (date: Date | null) => void
  handleOpenCalander?: () => void
  required?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholderText,
  locale,
  value,
  minDate,
  selected,
  hasError = false,
  errorMessage,
  handleChange,
  onInputClick,
  handleCloseCalander,
  handleOpenCalander,
  required,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )
  const className = cn(
    styles.inputContainer,
    styles.inputContainerVariants[datePickerState],
    {
      [styles.hasError]: hasError,
    },
  )

  useEffect(() => {
    if (locale === 'is') {
      registerLocale('is', is)
    } else if (locale === 'pl') {
      registerLocale('pl', pl)
    }
  }, [locale])

  const getLocale = (locale?: Locale) => {
    return locale === 'is' ? is : locale === 'pl' ? pl : en
  }

  const CustomInput = React.forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void; placeholderText?: string }
  >(({ value, onClick = () => undefined, placeholderText }, ref) => {
    const valueAsDate = value === undefined ? new Date() : new Date(value)

    return (
      <button className={className} onClick={onClick}>
        <div className={styles.labelAndPlaceholderContainer}>
          <p className={cn(styles.label, { [styles.labelError]: hasError })}>
            {label}
            {required && <span className={styles.requiredStar}> *</span>}
          </p>
          <div className={styles.value}>
            {value ? (
              <span data-testid="datepicker-value">
                <Typography variant="h3">
                  {format(valueAsDate, 'P', {
                    locale: getLocale(locale),
                  })}
                </Typography>
              </span>
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
  })

  return (
    <div className={coreStyles.root} data-testid="datepicker">
      <div className={cn(styles.root, 'island-ui-datepicker')}>
        <ReactDatePicker
          selected={selected ?? startDate}
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
          onCalendarOpen={() => {
            setDatePickerState('open')
            handleOpenCalander && handleOpenCalander()
          }}
          onCalendarClose={() => {
            setDatePickerState('closed')
            handleCloseCalander && handleCloseCalander(startDate)
          }}
          onChange={(date: Date) => {
            setStartDate(date)
            handleChange && handleChange(date)
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
      {hasError && errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  )
}

export default DatePicker
