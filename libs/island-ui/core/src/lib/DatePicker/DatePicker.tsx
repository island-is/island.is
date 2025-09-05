/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Select } from '../Select/Select'
import { Box } from '../Box/Box'
import { ScrollToSelectedMenuList } from '../Select/Components/ScrollToSelectedMenuList'

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
  calendarStartDay = 1,
  range = false,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(selected ?? null)
  const [endDate, setEndDate] = useState<Date | null>(null)

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
    setStartDate(selected ?? null)
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
          selected={startDate ?? selected}
          locale={currentLanguage.locale}
          minDate={minDate}
          maxDate={maxDate}
          excludeDates={excludeDates}
          formatWeekDay={(nameOfDay) => nameOfDay.toString().substr(0, 3)}
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
          onChange={
            range
              ? (date: any) => {
                  const [start, end] = date
                  setStartDate(start)
                  range && setEndDate(end)
                  if (range && end) {
                    start && handleChange && handleChange(start, end)
                  } else {
                    start && handleChange && handleChange(start)
                  }
                }
              : (date: any) => {
                  setStartDate(date)
                  handleChange && handleChange(date)
                }
          }
          startDate={startDate}
          endDate={range ? endDate : undefined}
          selectsRange={range}
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
  const shortMonth = month.slice(0, 3)
  const months = monthsIndex.map((i) => {
    if (locale.localize) {
      return locale.localize.month(i)
    }
    return undefined
  })

  const year = getYear(date)
  const currentYear = new Date().getFullYear()
  const defaultMin = currentYear - 100
  const defaultMax = currentYear + 10
  const years =
    (minYear && maxYear && minYear < maxYear && range(minYear, maxYear + 1)) ??
    range(defaultMin, defaultMax + 1)

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
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        columnGap={1}
        flexWrap="wrap"
        justifyContent="center"
      >
        <VisuallyHidden>
          <Text variant="h4" as="span" ref={monthRef}>
            {month}
          </Text>
        </VisuallyHidden>
        <Select
          size="xs"
          aria-label="Select month"
          className={styles.headerSelect}
          value={{ label: shortMonth, value: month }}
          onChange={(selectedOption) =>
            changeMonth(months.indexOf(selectedOption?.value))
          }
          options={months.map((option) => ({
            label: option.slice(0, 3),
            value: option,
          }))}
          styles={{
            control: (base) => ({
              ...base,
              textAlign: 'center',
              width: 'auto',
              marginRight: 4,
            }),
          }}
        />
        {years && years.length > 0 && (
          <Select
            size="xs"
            aria-label="Select year"
            className={styles.headerSelect}
            value={{
              label: year.toString(),
              value: year,
            }}
            onChange={(selectedOption) =>
              changeYear(Number(selectedOption?.value) ?? year)
            }
            options={years.map((option) => ({
              label: option.toString(),
              value: option,
            }))}
            styles={{
              control: (base) => ({
                ...base,
                textAlign: 'center',
                width: 'auto',
                marginRight: 4,
              }),
            }}
            components={{
              MenuList: ScrollToSelectedMenuList,
            }}
          />
        )}
      </Box>
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
