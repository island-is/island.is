import { ActionMeta, OptionsType, ValueType } from 'react-select'
import { AriaError, InputBackgroundColor } from '../Input/types'
import { Option } from '../Select/Select'

export interface CountryCodeSelectProps {
  name: string
  options: OptionsType<Option>
  id?: string
  disabled?: boolean
  onChange?: ((
    value: ValueType<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void) &
    ((value: ValueType<Option>, action: ActionMeta<Option>) => void)
  value?: ValueType<Option>
  placeholder?: string
  defaultValue?: Option
  isSearchable?: boolean
  size?: 'xs' | 'sm' | 'md'
  isCreatable?: boolean
  backgroundColor?: InputBackgroundColor
  ariaError?: AriaError
  isClearable?: boolean
  inputHasFocus?: boolean
  inputHasLabel?: boolean
  onFocus?: () => void
  onBlur?: () => void
  onMenuOpen?: () => void
  onMenuClose?: () => void
}
