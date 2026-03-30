/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisuallyHidden } from '@ariakit/react'
import {
  dateFormat,
  dateFormatWithTime,
  timeFormat,
} from '@island.is/shared/constants'
import cn from 'classnames'
import getYear from 'date-fns/getYear'
import isValid from 'date-fns/isValid'
import en from 'date-fns/locale/en-US'
import is from 'date-fns/locale/is'
import parse from 'date-fns/parse'
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

import { theme } from '@island.is/island-ui/theme'
import { Box } from '../Box/Box'
import { Input } from '../Input/Input'
import { InputProps } from '../Input/types'
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
  handleClear,
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
  range = false,
  ranges,
  selectedRange,
  highlightWeekends = false,
  isClearable = false,
  clearLabel,
  displaySelectInput = false,
  detachedCalendar = false,
  fixedHeight = false,
}) => {
  const isValidDate = (d: unknown): d is Date =>
    d instanceof Date && !isNaN((d as Date).getTime())
  const normalizeDate = (d?: Date | null) => (d && isValidDate(d) ? d : null)

  const [startDate, setStartDate] = useState<Date | null>(
    normalizeDate(range ? selectedRange?.startDate : selected) ?? null,
  )
  const [endDate, setEndDate] = useState<Date | null>(
    normalizeDate(range ? selectedRange?.endDate : null) ?? null,
  )
  const datePickerRef = useRef<ReactDatePicker>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [datePickerState, setDatePickerState] = useState<'open' | 'closed'>(
    'closed',
  )
  const [isOpen, setIsOpen] = useState(false)
  const hoverDateRef = React.useRef<Date | null>(null)
  const [shouldAlignEnd, setShouldAlignEnd] = useState(false)

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
    if (range && selectedRange) {
      setStartDate(normalizeDate(selectedRange.startDate) ?? null)
      setEndDate(normalizeDate(selectedRange.endDate) ?? null)
    } else {
      setStartDate(normalizeDate(selected) ?? null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, selectedRange])

  return (
    <div
      ref={containerRef}
      className={coreStyles.root}
      data-testid="datepicker"
    >
      <div
        className={cn(styles.root, 'island-ui-datepicker', {
          [styles.small]: size === 'sm',
          [styles.extraSmall]: size === 'xs',
          [styles.medium]: size === 'md',
          [styles.detached]: detachedCalendar,
        })}
      >
        <ReactDatePicker
          ref={datePickerRef}
          popperClassName={cn(styles.popper, {
            [styles.popperInline]: appearInline,
            [styles.popperXsmall]: size === 'xs',
            [styles.popperSmall]: size === 'sm',
            [styles.popperSmallWithoutLabel]: size === 'sm' && !label,
            [styles.popperWithoutLabel]: size === 'md' && !label,
            [styles.popperAlignEnd]: shouldAlignEnd,
          })}
          id={id}
          name={name}
          disabled={disabled}
          preventOpenOnFocus={range}
          selected={
            range ? undefined : normalizeDate(startDate ?? selected) ?? null
          }
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
          fixedHeight={fixedHeight}
          showPopperArrow={false}
          popperPlacement="bottom-start"
          open={isOpen}
          onInputClick={() => {
            if (!range) setIsOpen(true)
            onInputClick && onInputClick()
          }}
          onCalendarOpen={() => {
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect()
              const calendarWidth = 310
              setShouldAlignEnd(rect.left + calendarWidth > window.innerWidth)
            }
            setDatePickerState('open')
            setIsOpen(true)
            handleOpenCalendar && handleOpenCalendar()
          }}
          onCalendarClose={() => {
            setDatePickerState('closed')
            setIsOpen(false)
            hoverDateRef.current = null
            handleCloseCalendar && handleCloseCalendar(startDate)
          }}
          // We handle closing manually in range mode
          shouldCloseOnSelect={!range}
          onClickOutside={() => setIsOpen(false)}
          closeOnScroll={false}
          onChange={
            range
              ? (date: any) => {
                  const [start, end] = date

                  if (start === null && end === null) {
                    setStartDate(null)
                    setEndDate(null)
                    return
                  }

                  if (
                    start instanceof Date &&
                    !isNaN(start.getTime()) &&
                    (end === null ||
                      (end instanceof Date && !isNaN(end.getTime())))
                  ) {
                    if (
                      end === null &&
                      startDate !== null &&
                      endDate === null &&
                      start < startDate
                    ) {
                      setStartDate(start)
                      setEndDate(startDate)
                      hoverDateRef.current = null
                      setIsOpen(false)
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ;(datePickerRef.current as any)?.setState({
                        inputValue: null,
                      })
                      handleChange && handleChange(start, startDate)
                      return
                    }

                    setStartDate(start)
                    setEndDate(end)

                    if (end === null) {
                      setIsOpen(true)
                    } else {
                      hoverDateRef.current = null
                      setIsOpen(false)
                    }

                    if (end !== null && handleChange) {
                      handleChange(start, end)
                    }
                  }
                }
              : (date: any) => {
                  if (date === null) {
                    setStartDate(null)
                    // also close when cleared via calendar UI (if ever)
                    setIsOpen(false)
                    return
                  }
                  if (date instanceof Date && !isNaN(date.getTime())) {
                    setStartDate(date)
                    handleChange && handleChange(date)
                    // close after single-date selection
                    setIsOpen(false)
                  }
                }
          }
          onChangeRaw={(e: React.SyntheticEvent<HTMLInputElement>) => {
            if (!range) return
            const v = (e.target as HTMLInputElement).value
            // If the input is cleared via keyboard, reset both dates
            if (!v || v.trim() === '') {
              setStartDate(null)
              setEndDate(null)
            }
          }}
          onKeyDown={(e) => {
            if (!range) {
              if (e.key === 'Enter' || e.key === 'ArrowDown') setIsOpen(true)
              if (e.key === 'Escape') setIsOpen(false)
              return
            }

            if (e.key === 'Escape') {
              setIsOpen(false)
              return
            }
            if (e.key === 'ArrowDown') {
              setIsOpen(true)
              return
            }
            if (e.key === 'Enter') {
              e.preventDefault()
              const v = (e.target as HTMLInputElement).value
              if (!v || v.trim() === '') return
              const parts = v.split(' - ')
              if (parts.length !== 2) return
              const fmt = showTimeInput
                ? currentLanguage.formatWithTime
                : currentLanguage.format
              const parsedStart = parse(parts[0].trim(), fmt, new Date())
              const parsedEnd = parse(parts[1].trim(), fmt, new Date())
              if (!isValid(parsedStart) || !isValid(parsedEnd)) return
              const [s, end2] =
                parsedEnd < parsedStart
                  ? [parsedEnd, parsedStart]
                  : [parsedStart, parsedEnd]
              setStartDate(s)
              setEndDate(end2)
              setIsOpen(false)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(datePickerRef.current as any)?.setState({ inputValue: null })
              handleChange && handleChange(s, end2)
            }
          }}
          onDayMouseEnter={
            range
              ? (date: Date) => {
                  hoverDateRef.current = startDate && !endDate ? date : null
                }
              : undefined
          }
          dayClassName={
            range
              ? (date: Date) => {
                  const hover = hoverDateRef.current
                  if (!startDate || endDate !== null || !hover) return null
                  if (hover >= startDate) return null
                  return date >= hover && date <= startDate
                    ? 'react-datepicker__day--in-selecting-range'
                    : null
                }
              : undefined
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
              fixedFocusState={
                detachedCalendar ? false : datePickerState === 'open'
              }
              hasError={hasError}
              placeholderText={placeholderText}
              onInputClick={onInputClick}
              backgroundColor={backgroundColor}
              icon={icon}
              isClearable={isClearable}
              clearLabel={clearLabel}
              size={size}
              onClick={onInputClick}
              onIconClick={range ? () => setIsOpen((prev) => !prev) : undefined}
              onClear={() => {
                setStartDate(null)
                setEndDate(null)
                handleClear && handleClear()
                setIsOpen(false)
              }}
            />
          }
          calendarStartDay={highlightWeekends ? 1 : calendarStartDay}
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

                if (startDay && endDay) {
                  handleChange && handleChange(startDay, endDay)
                  // if range completed via custom container (quick ranges etc.)
                  setIsOpen(false)
                }
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
    clearLabel?: string
    onClear?: () => void
    onInputClick?: ReactDatePickerProps['onInputClick']
    onIconClick?: () => void
  }
>(
  (
    {
      className,
      placeholderText,
      onInputClick,
      onIconClick,
      fixedFocusState,
      icon,
      onClick,
      ...props
    },
    ref,
  ) => (
    <Input
      {...props}
      icon={
        onIconClick && icon
          ? {
              ...icon,
              onClick: onIconClick,
              ariaLabel: 'Open calendar',
            }
          : icon
      }
      onClick={onIconClick ? undefined : onClick}
      ref={ref}
      fixedFocusState={fixedFocusState}
      placeholder={placeholderText}
      buttons={
        props.isClearable
          ? [
              {
                name: 'close',
                type: 'outline',
                label: props.clearLabel || 'Clear',
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
            value={{ label: month.slice(0, 3), value: month }}
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
                marginRight: theme.spacing.smallGutter,
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
                  marginRight: theme.spacing.smallGutter,
                }),
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
              marginRight: theme.spacing[1],
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
