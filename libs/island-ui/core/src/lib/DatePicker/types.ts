import { ReactDatePickerProps } from 'react-datepicker'
import { Icon as IconType, Type } from '../IconRC/iconMap'

import pl from 'date-fns/locale/pl'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

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

export type BackgroundColor = 'white' | 'blue'
export type Size = 'md' | 'sm'

export interface Props {
  label: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: LocaleKeys
  minDate?: ReactDatePickerProps['minDate']
  maxDate?: ReactDatePickerProps['maxDate']
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
  size?: Size
  backgroundColor?: BackgroundColor
  icon?: IconType
  iconType?: Type
}

export interface CustomHeaderProps {
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
