import * as React from 'react'
import { useEffect, useRef, useState, forwardRef } from 'react'
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
import { Icon as IconType, Type } from '../IconRC/iconMap'

const languageConfig = {
  is: {
    format: 'dd.MM.yyyy',
    locale: is,
  },
  en: {
    format: 'MM/dd/yyyy',
    locale: en,
  },
  pl: {
    format: 'dd.MM.yyyy',
    locale: pl,
  },
}

type LocaleKeys = keyof typeof languageConfig

interface DatePickerProps {
  label: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: LocaleKeys
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
  size?: 'md' | 'sm'
  backgroundColor?: 'white' | 'blue'
  icon?: IconType
  iconType?: Type
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
  backgroundColor = 'white',
  size = 'md',
  icon = 'calendar',
  iconType = 'outline',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selected ?? null)
  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )
  const currentLanguage = languageConfig[locale]

  useEffect(() => {
    if (locale === 'is') {
      registerLocale('is', is)
    } else if (locale === 'pl') {
      registerLocale('pl', pl)
    }
  }, [locale])

  useEffect(() => {
    setStartDate(selected ?? null)
  }, [selected])

  return (
    <div className={coreStyles.root} data-testid="datepicker">
      <div
        className={cn(styles.root, 'island-ui-datepicker', {
          [styles.small]: size === 'sm',
        })}
      >
        <ReactDatePicker
          id={id}
          disabled={disabled}
          selected={selected ?? startDate}
          locale={currentLanguage.locale}
          minDate={minDate}
          dateFormat={currentLanguage.format}
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
          startDate={startDate}
          required={required}
          autoComplete="off"
          calendarClassName={cn({
            [styles.backgroundBlue]: backgroundColor === 'blue',
          })}
          customInput={
            <CustomInput
              name={inputName}
              label={label}
              fixedFocusState={datePickerState === 'open'}
              hasError={hasError}
              errorMessage={errorMessage}
              placeholderText={placeholderText}
              onInputClick={onInputClick}
              backgroundColor={backgroundColor}
              icon={icon}
              iconType={iconType}
              size={size}
            />
          }
          renderCustomHeader={(props) => (
            <CustomHeader locale={currentLanguage.locale} {...props} />
          )}
        />
      </div>
    </div>
  )
}

const CustomInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps & {
    placeholderText?: string
    onInputClick?: ReactDatePickerProps['onInputClick']
  }
>(
  (
    {
      className,
      placeholderText,
      onInputClick,
      fixedFocusState,
      icon,
      iconType,
      ...props
    },
    ref,
  ) => (
    <Input
      {...props}
      icon={icon}
      iconType={iconType}
      ref={ref}
      fixedFocusState={fixedFocusState}
      placeholder={placeholderText}
    />
  ),
)

const monthsIndex = [...Array(12).keys()]

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  changeMonth,
  locale,
}: CustomHeaderProps) => {
  const monthRef = useRef<HTMLSpanElement>(null)
  const month = locale.localize ? locale.localize.month(date.getMonth()) : ''
  const months = monthsIndex.map((i) => {
    if (locale.localize) {
      return locale.localize.month(i)
    }
    return undefined
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
            <option key={option} value={option}>
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
