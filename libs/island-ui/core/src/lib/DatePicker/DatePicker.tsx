import * as React from 'react'
import { useEffect, useRef, useState, forwardRef } from 'react'
import cn from 'classnames'
import {
  default as ReactDatePicker,
  registerLocale,
  ReactDatePickerProps,
} from 'react-datepicker'
import getYear from 'date-fns/getYear'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'
import {
  dateFormat,
  timeFormat,
  dateFormatWithTime,
} from '@island.is/shared/constants'
import { VisuallyHidden } from '@ariakit/react'
import range from 'lodash/range'

import { Icon } from '../IconRC/Icon'
import { ErrorMessage } from '../Input/ErrorMessage'
import { Text } from '../Text/Text'

import * as styles from './DatePicker.css'
import * as coreStyles from './react-datepicker.css'
import { Input } from '../Input/Input'
import { InputProps } from '../Input/types'
import { DatePickerProps, DatePickerCustomHeaderProps } from './types'

const languageConfig = {
  is: {
    format: dateFormat.is,
    formatWithTime: dateFormatWithTime.is,
    timeFormat: timeFormat.is,
    locale: is,
  },
  en: {
    format: dateFormat.en,
    formatWithTime: dateFormatWithTime.en,
    timeFormat: timeFormat.en,
    locale: en,
  },
}

export const DatePicker: React.FC<React.PropsWithChildren<DatePickerProps>> = ({
  name,
  id = name,
  label,
  placeholderText,
  locale = 'en',
  minDate,
  maxDate,
  excludeDates,
  selected,
  disabled = false,
  errorMessage,
  hasError = Boolean(errorMessage),
  handleChange,
  onInputClick,
  handleCloseCalendar,
  handleOpenCalendar,
  required,
  inputName = '',
  backgroundColor = 'white',
  appearInline = false,
  size = 'md',
  icon = { name: 'calendar', type: 'outline' },
  minYear,
  maxYear,
  showTimeInput = false,
  timeInputLabel = 'Tími:',
  readOnly = false,
  calendarStartDay = 0,
}) => {
  const isValidDate = (d: unknown): d is Date =>
    d instanceof Date && !isNaN((d as Date).getTime())
  const normalizeDate = (d?: Date | null) => (d && isValidDate(d) ? d : null)

  const [startDate, setStartDate] = useState<Date | null>(
    normalizeDate(selected) ?? null,
  )
  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )
  const currentLanguage = languageConfig[locale]
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

  useEffect(() => {
    if (locale === 'en') {
      registerLocale('en', en)
    } else {
      registerLocale('is', is)
    }
  }, [locale])

  useEffect(() => {
    setStartDate(normalizeDate(selected) ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  return (
    <div className={coreStyles.root} data-testid="datepicker">
      <div
        className={cn(styles.root, 'island-ui-datepicker', {
          [styles.small]: size === 'sm',
          [styles.extraSmall]: size === 'xs',
        })}
      >
        <ReactDatePicker
          popperClassName={cn(styles.popper, {
            [styles.popperInline]: appearInline,
            [styles.popperXsmall]: size === 'xs',
            [styles.popperSmall]: size === 'sm',
            [styles.popperSmallWithoutLabel]: size === 'sm' && !label,
            [styles.popperWithoutLabel]: size === 'md' && !label,
          })}
          id={id}
          name={name}
          disabled={disabled}
          selected={normalizeDate(startDate ?? selected) ?? null}
          locale={currentLanguage.locale}
          minDate={minDate}
          maxDate={maxDate}
          excludeDates={excludeDates}
          dateFormat={
            showTimeInput
              ? currentLanguage.formatWithTime
              : currentLanguage.format
          }
          showPopperArrow={false}
          popperPlacement="bottom-start"
          onCalendarOpen={() => {
            setDatePickerState('open')
            handleOpenCalendar && handleOpenCalendar()
          }}
          onCalendarClose={() => {
            setDatePickerState('closed')
            handleCloseCalendar && handleCloseCalendar(startDate)
          }}
          onChange={(date: Date | null) => {
            if (date === null) {
              setStartDate(null)
              return
            }
            if (date instanceof Date && !isNaN(date.getTime())) {
              setStartDate(date)
              handleChange && handleChange(date)
            }
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
              placeholderText={placeholderText}
              onInputClick={onInputClick}
              backgroundColor={backgroundColor}
              icon={icon}
              size={size}
            />
          }
          calendarStartDay={calendarStartDay}
          timeFormat={currentLanguage.timeFormat}
          timeInputLabel={timeInputLabel}
          showTimeInput={showTimeInput}
          readOnly={readOnly}
          renderCustomHeader={(props) => (
            <CustomHeader
              locale={currentLanguage.locale}
              minYear={minYear}
              maxYear={maxYear}
              {...props}
            />
          )}
          {...ariaError}
        />
        {hasError && errorMessage && (
          <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
        )}
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
      ...props
    },
    ref,
  ) => (
    <Input
      {...props}
      icon={icon}
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
  changeYear,
  locale,
  minYear,
  maxYear,
}: DatePickerCustomHeaderProps) => {
  const monthRef = useRef<HTMLSpanElement>(null)
  const month = locale.localize ? locale.localize.month(date.getMonth()) : ''
  const months = monthsIndex.map((i) => {
    if (locale.localize) {
      return locale.localize.month(i)
    }
    return undefined
  })
  const years =
    minYear && maxYear && minYear < maxYear && range(minYear, maxYear + 1)
  return (
    <div
      className={cn(styles.customHeaderContainer, 'date-picker-custom-header')}
    >
      <button
        type="button"
        onClick={decreaseMonth}
        className={styles.decreaseButton}
        aria-label="Previous month"
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
          aria-label="Select month"
          className={styles.headerSelect}
          value={month}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
          style={{
            textAlign: 'center',
            width: 'auto',
            marginRight: 8,
          }}
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {years && years.length > 0 ? (
          <select
            className={styles.headerSelect}
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <Text variant="h4" as="span">
            {getYear(date)}
          </Text>
        )}
      </div>
      <button
        data-testid="datepickerIncreaseMonth"
        type="button"
        onClick={increaseMonth}
        className={styles.increaseButton}
        aria-label="Next month"
      >
        <Icon icon="chevronForward" type="outline" color="blue400" />
      </button>
    </div>
  )
}
