/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisuallyHidden } from '@ariakit/react'
import {
  dateFormat,
  dateFormatWithTime,
  timeFormat,
} from '@island.is/shared/constants'
import cn from 'classnames'
import getYear from 'date-fns/getYear'
import en from 'date-fns/locale/en-US'
import is from 'date-fns/locale/is'
import range from 'lodash/range'
import * as React from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  default as ReactDatePicker,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker'
import { Icon } from '../IconRC/Icon'
import { ErrorMessage } from '../Input/ErrorMessage'
import { Text } from '../Text/Text'

import { Box } from '../Box/Box'
import { Input } from '../Input/Input'
import { InputProps } from '../Input/types'
import { ScrollToSelectedMenuList } from '../Select/Components/ScrollToSelectedMenuList'
import { Select } from '../Select/Select'
import CustomCalendarContainer from './CustomCalendarContainer'
import * as styles from './DatePicker.css'
import * as coreStyles from './react-datepicker.css'
import { DatePickerCustomHeaderProps, DatePickerProps } from './types'

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
  locale = 'is',
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
  ranges,
  highlightWeekends = false,
  isClearable = false,
  displaySelectInput = false,
}) => {
  const isValidDate = (d: unknown): d is Date =>
    d instanceof Date && !isNaN((d as Date).getTime())
  const normalizeDate = (d?: Date | null) => (d && isValidDate(d) ? d : null)
  const [startDate, setStartDate] = useState<Date | null>(
    normalizeDate(selected) ?? null,
  )
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
          key={
            range
              ? `${startDate?.getTime()}-${endDate?.getTime()}`
              : startDate?.getTime()
          }
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
          locale={currentLanguage.locale ?? 'is'}
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
                  if (date === null) {
                    setStartDate(null)
                    return
                  }

                  const [start, end] = date
                  if (
                    start instanceof Date &&
                    !isNaN(start.getTime()) &&
                    (end === null ||
                      (end instanceof Date && !isNaN(end.getTime())))
                  ) {
                    setStartDate(start)
                    range && setEndDate(end)
                    if (range && end) {
                      start && handleChange && handleChange(start, end)
                    } else {
                      start && handleChange && handleChange(start)
                    }
                  }
                }
              : (date: any) => {
                  if (date === null) {
                    setStartDate(null)
                    return
                  }
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    setStartDate(date)
                    handleChange && handleChange(date)
                  }
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
              isClearable={isClearable}
              size={size}
              onClear={() => {
                setStartDate(null)
                setEndDate(null)
              }}
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
              displaySelectInput={displaySelectInput}
              {...props}
            />
          )}
          calendarContainer={(props) => (
            <CustomCalendarContainer
              {...props}
              startDate={startDate}
              endDate={endDate}
              setDate={(startDay, endDay) => {
                setStartDate(startDay)
                endDay && setEndDate(endDay)

                handleChange &&
                  startDay &&
                  endDay &&
                  handleChange(startDay, endDay)
              }}
              ranges={ranges}
              highlightWeekends={highlightWeekends}
              displaySelectInput={displaySelectInput}
              children={props.children}
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
    isClearable?: boolean
    onClear?: () => void
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
      buttons={
        props.isClearable
          ? [
              {
                name: 'close',
                type: 'outline',
                label: 'Closeit',
                onClick: props.onClear,
                disabled: props.disabled,
              },
            ]
          : undefined
      }
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
  displaySelectInput = false,
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
      {displaySelectInput ? (
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
      ) : (
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
      )}

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
