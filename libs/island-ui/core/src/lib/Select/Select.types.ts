// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import { createFilter, GroupBase, Props } from 'react-select'

import { Icon as IconTypes } from '../IconRC/iconMap'
import { InputBackgroundColor } from '../Input/types'

type ArgumentTypes<F extends () => unknown> = F extends (
  ...args: infer A
) => unknown
  ? A
  : never
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
type FilterConfig = ArgumentTypes<typeof createFilter>[0]

export interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>,
  > {
    // Common custom props added for our custom Select
    backgroundColor?: InputBackgroundColor
    errorMessage?: string
    filterConfig?: FilterConfig
    hasError?: boolean
    icon?: IconTypes
    isCreatable?: boolean
    label?: string
    size?: 'xs' | 'sm' | 'md'

    // Added as prop to forward to custom Input component
    ariaError?: AriaError

    // Added for CountryCodeSelect to forward prop to custom IndicatorsContainer component
    inputHasLabel?: boolean

    // Added for test support
    dataTestId?: string
  }
}

// The typescript declaration customisations above does not allow to change existing props signature.
// Therefore, we create our own Prop type to overwrite props.
export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
> = Omit<Props<Option, IsMulti, Group>, 'noOptionsMessage'> & {
  noOptionsMessage?: string
}

// The Option type needs to be generic as the react-select library is generic.
export type Option<Value> = {
  label: string
  value: Value
  description?: string
  descriptionTruncated?: boolean
  disabled?: boolean
}

// Utility option types
export type StringOption = Option<string>
