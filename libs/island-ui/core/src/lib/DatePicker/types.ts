import { ReactDatePickerProps } from 'react-datepicker'
import { dateFormat } from '@island.is/shared/constants'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

import { Icon as IconType, Type } from '../IconRC/iconMap'

const languageConfig = {
  is: {
    format: dateFormat.is,
    locale: is,
  },
  en: {
    format: dateFormat.en,
    locale: en,
  },
}

type LocaleKeys = keyof typeof languageConfig

export type DatePickerBackgroundColor = 'white' | 'blue'
export type DatePickerSize = 'xs' | 'sm' | 'md'

export interface DatePickerProps {
  name?: string
  label?: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: LocaleKeys
  minDate?: ReactDatePickerProps['minDate']
  maxDate?: ReactDatePickerProps['maxDate']
  excludeDates?: ReactDatePickerProps['excludeDates']
  selected?: ReactDatePickerProps['selected']
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  id?: string
  handleChange?: (startDate: Date, endDate?: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
  handleCloseCalendar?: (date: Date | null) => void
  handleOpenCalendar?: () => void
  handleClear?: () => void
  required?: boolean
  inputName?: string
  appearInline?: boolean
  size?: DatePickerSize
  backgroundColor?: DatePickerBackgroundColor
  icon?: { name: IconType; type?: Type }
  showTimeInput?: boolean
  timeInputLabel?: string
  isClearable?: boolean
  clearLabel?: string
  highlightWeekends?: boolean
  displaySelectInput?: boolean // Whether month and year should be selectable via dropdowns
  /**
   * Minimum selectable year inside datepicker
   */
  minYear?: number
  /**
   * Maximum selectable year inside datepicker
   */
  maxYear?: number
  readOnly?: boolean
  calendarStartDay?: number
  /**
   * Whether the datepicker should allow selecting a range of dates
   */
  range?: boolean
  /**
   * Predefined date ranges for quick selection
   */
  ranges?: { label: string; startDate: Date; endDate: Date }[]
  selectedRange?: {
    startDate?: Date | null
    endDate?: Date | null
  }
  detatchedCalendar?: boolean
}

export interface DatePickerCustomHeaderProps {
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
  minYear?: number
  maxYear?: number
  displaySelectInput?: boolean // Should the month and year be selectable via dropdowns
}
