import { Option, OptionValue, SelectProps } from '../Select/Select.types'

type PropsFromSelectProps<Opt extends Option, Value extends OptionValue> = Pick<
  SelectProps<Opt, Value>,
  | 'name'
  | 'options'
  | 'id'
  | 'disabled'
  | 'onChange'
  | 'value'
  | 'placeholder'
  | 'defaultValue'
  | 'isSearchable'
  | 'size'
  | 'isCreatable'
  | 'backgroundColor'
  | 'ariaError'
  | 'isClearable'
>

export type CountryCodeSelectPropsWithOptions<
  Value extends OptionValue = string
> = CountryCodeSelectProps<Option, Value>

export type CountryCodeSelectProps<
  Opt extends Option,
  Value extends OptionValue
> = PropsFromSelectProps<Opt, Value> & {
  inputHasFocus?: boolean
  inputHasLabel?: boolean
  onFocus?: () => void
  onBlur?: () => void
  onMenuOpen?: () => void
  onMenuClose?: () => void
}
