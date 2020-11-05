import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import {
  default as ReactDatePicker,
  registerLocale,
  ReactDatePickerProps,
} from 'react-datepicker'
import getYear from 'date-fns/getYear'
import pl from 'date-fns/locale/pl'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

import { Icon } from '../IconRC/Icon'
import { Text } from '../Text/Text'

import * as styles from './DatePicker.treat'
import * as coreStyles from './react-datepicker.treat'
import { Input, InputProps } from '../Input/Input'
import { VisuallyHidden } from 'reakit'

type Locale = 'is' | 'pl' | 'en'

interface DatePickerProps {
  label: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: Locale
  minDate?: ReactDatePickerProps['minDate']
  selected?: ReactDatePickerProps['selected']
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  id?: string
  handleChange?: (startDate: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
  handleCloseCalendar?: (date: Date | null) => void
  handleOpenCalendar?: () => void
  required?: boolean
  inputName?: string
}

interface CustomHeaderProps {
  date: Date
  changeYear(year: number): void
  changeMonth(month: number): void
  decreaseMonth(): void
  increaseMonth(): void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
  decreaseYear(): void
  increaseYear(): void
  prevYearButtonDisabled: boolean
  nextYearButtonDisabled: boolean
  locale: Locale
}

const getFormat = (locale: Locale) => {
  switch (locale) {
    case 'is':
      return 'dd.MM.yyyy'
    case 'en':
      return 'MM/dd/yyyy'
    case 'pl':
      return 'dd.MM.yyyy'
    default:
      return 'dd.MM.yyyy'
  }
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  label,
  placeholderText,
  locale = 'en',
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
  inputName = '',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selected ?? null)
  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )

  useEffect(() => {
    if (locale === 'is') {
      registerLocale('is', is)
    } else if (locale === 'pl') {
      registerLocale('pl', pl)
    }
  }, [locale])
  return (
    <div className={coreStyles.root} data-testid="datepicker">
      <div className={cn(styles.root, 'island-ui-datepicker')}>
        <ReactDatePicker
          id={id}
          disabled={disabled}
          selected={selected ?? startDate}
          locale={locale}
          minDate={minDate}
          dateFormat={getFormat(locale)}
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
          onChange={(date: any) => {
            setStartDate(date)
            handleChange && handleChange(date)
          }}
          startDate={startDate}
          required={required}
          customInput={
            <CustomInput
              name={inputName}
              label={label}
              fixedFocusState={datePickerState === 'open'}
              hasError={hasError}
              errorMessage={errorMessage}
              placeholderText={placeholderText}
              onInputClick={onInputClick}
            />
          }
          renderCustomHeader={(props) => (
            <CustomHeader locale={locale} {...props} />
          )}
        />
      </div>
    </div>
  )
}

const CustomInput = ({
  className,
  placeholderText,
  onInputClick,
  fixedFocusState,
  ...props
}: InputProps & {
  placeholderText?: string
  onInputClick?: ReactDatePickerProps['onInputClick']
}) => (
  <Input
    {...props}
    icon="calendar"
    iconType="outline"
    fixedFocusState={fixedFocusState}
    placeholder={placeholderText}
  />
)

const getLocale = (locale: Locale) => {
  return locale === 'is' ? is : locale === 'pl' ? pl : en
}

const monthsIndex = [...Array(12).keys()]

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  changeMonth,
  locale,
}: CustomHeaderProps) => {
  const currentLocale = getLocale(locale)
  const monthRef = useRef<HTMLSpanElement>(null)
  const month = currentLocale.localize
    ? currentLocale.localize.month(date.getMonth())
    : ''
  const months = monthsIndex.map((i) => {
    if (currentLocale.localize) {
      return currentLocale.localize.month(i)
    }
    return
  })
  return (
    <div className={styles.customHeaderContainer}>
      <button
        type="button"
        onClick={decreaseMonth}
        className={styles.decreaseButton}
      >
        <Icon icon="chevronBack" type="outline" color="blue400" />
      </button>
      <div>
        <VisuallyHidden>
          <Text variant="h4" as="span" ref={monthRef}>
            {month}
          </Text>
        </VisuallyHidden>
        <select
          className={styles.headerSelect}
          value={month}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
          style={{
            width: monthRef?.current?.offsetWidth ?? 'auto',
            marginRight: 8,
          }}
        >
          {months.map((option) => (
            <option key={option} value={option} selected={option === month}>
              {option}
            </option>
          ))}
        </select>
        <Text variant="h4" as="span">
          {getYear(date)}
        </Text>
      </div>
      <button
        type="button"
        onClick={increaseMonth}
        className={styles.increaseButton}
      >
        <Icon icon="chevronForward" type="outline" color="blue400" />
      </button>
    </div>
  )
}
