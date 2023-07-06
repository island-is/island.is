import {
  GroupBase,
  ActionMeta,
  createFilter,
  Props,
  SingleValue as SingleValueType,
} from 'react-select'

import { InputBackgroundColor } from '../Input/types'
import { Icon as IconTypes } from '../IconRC/iconMap'
import { CountryCodeSelectPropsWithOptions } from '../PhoneInput/PhoneInput.types'

declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    icon: SelectPropsWithOptions['icon']
    hasError?: SelectPropsWithOptions['hasError']
    size?: SelectPropsWithOptions['size']
    dataTestId?: string
    ariaError?: SelectPropsWithOptions['ariaError']
    label?: SelectPropsWithOptions['label']
    inputHasLabel?: CountryCodeSelectPropsWithOptions['inputHasLabel']
  }
}

type ArgumentTypes<F extends () => unknown> = F extends (
  ...args: infer A
) => unknown
  ? A
  : never

type FilterConfig = ArgumentTypes<typeof createFilter>[0]

export interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export type OptionValue = string | number

export type Option<Value extends OptionValue = string> = {
  label: string
  value: Value
  description?: string
  descriptionTruncated?: boolean
  disabled?: boolean
}

export type ReactSelectProps = Props<Option>

export interface SelectProps<Opt extends Option, Value extends OptionValue> {
  name: string
  options: Option<Value>[]
  id?: string
  disabled?: boolean
  onChange?(
    newValue: Option<Value>,
    actionMeta: ActionMeta<Option<Value>>,
  ): void
  value?: SingleValueType<Opt>
  placeholder?: string
  defaultValue?: Opt
  isSearchable?: boolean
  size?: 'xs' | 'sm' | 'md'
  isCreatable?: boolean
  backgroundColor?: InputBackgroundColor
  ariaError?: AriaError
  isClearable?: boolean
  hasError?: boolean
  errorMessage?: string
  noOptionsMessage?: string
  label?: string
  icon?: IconTypes
  required?: boolean
  formatGroupLabel?: ReactSelectProps['formatGroupLabel']
  filterConfig?: FilterConfig
}

export type SelectPropsWithOptions<
  Value extends OptionValue = string
> = SelectProps<Option, Value>

export type SelectOnChange<
  Value extends OptionValue = string
> = SelectPropsWithOptions<Value>['onChange']
