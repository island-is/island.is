import * as React from 'react'
import { useEffect, useState } from 'react'
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

import { Icon } from '../IconRC/Icon'
import { Text } from '../Text/Text'

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
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  id?: string
  handleChange?: (date: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
  handleCloseCalendar?: (date: Date | null) => void
  handleOpenCalendar?: () => void
  required?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  label,
  placeholderText,
  locale,
  value,
  minDate,
  selected,
  disabled = false,
  hasError = false,
  errorMessage,
  handleChange,
  onInputClick,
  handleCloseCalendar,
  handleOpenCalendar,
  required,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selected ?? null)
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
      <button type="button" className={className} onClick={onClick}>
        <div className={styles.labelAndPlaceholderContainer}>
          <p className={cn(styles.label, { [styles.labelError]: hasError })}>
            {label}
            {required && <span className={styles.requiredStar}> *</span>}
          </p>
          <div className={styles.value}>
            {value ? (
              <span data-testid="datepicker-value">
                <Text variant="h3">
                  {format(valueAsDate, 'P', {
                    locale: getLocale(locale),
                  })}
                </Text>
              </span>
            ) : placeholderText ? (
              <Text as="span" color="dark300">
                {placeholderText}
              </Text>
            ) : null}
          </div>
        </div>
        <Icon icon="calendar" type="outline" color="blue400" size="large" />
      </button>
    )
  })

  return (
    <div className={coreStyles.root} data-testid="datepicker">
      <div className={cn(styles.root, 'island-ui-datepicker')}>
        <ReactDatePicker
          id={id}
          disabled={disabled}
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
            handleOpenCalendar && handleOpenCalendar()
          }}
          onCalendarClose={() => {
            setDatePickerState('closed')
            handleCloseCalendar && handleCloseCalendar(startDate)
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
                  type="button"
                  onClick={decreaseMonth}
                  className={styles.decreaseButton}
                >
                  <Icon icon="chevronBack" type="outline" color="blue400" />
                </button>
                <Text variant="h4">{`${capitalizedMonth} ${getYear(
                  date,
                )}`}</Text>
                <button
                  type="button"
                  onClick={increaseMonth}
                  className={styles.increaseButton}
                >
                  <Icon icon="chevronForward" type="outline" color="blue400" />
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
