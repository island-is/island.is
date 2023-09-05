// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import { GroupBase, Props } from 'react-select'

import { Option as OptionType } from '../Select/Select.types'

type PropsFromSelectProps<Value> = Pick<
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  Props<OptionType<Value>, false, GroupBase<OptionType<Value>>>,
  | 'name'
  | 'options'
  | 'id'
  | 'isDisabled'
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
  | 'dataTestId'
>

export type CountryCodeSelectProps = PropsFromSelectProps<string> & {
  inputHasFocus?: boolean
  inputHasLabel?: boolean
  onFocus?(): void
  onBlur?(): void
  onMenuOpen?(): void
  onMenuClose?(): void
}
