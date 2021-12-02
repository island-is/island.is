import React, { ComponentType } from 'react'
import cn from 'classnames'
import {
  components,
  MenuProps,
  OptionProps,
  OptionsType,
  GroupedOptionsType,
  ActionMeta,
  ValueType,
  IndicatorContainerProps,
  ControlProps,
  InputProps,
  PlaceholderProps,
  ValueContainerProps,
  SingleValueProps,
  IndicatorProps,
  Props,
} from 'react-select'
import { formatGroupLabel } from 'react-select/src/builtins'
import { AriaError, InputBackgroundColor } from '../../Input/types'
import { Icon } from '../../IconRC/Icon'
import * as styles from '../Select.css'

export type ReactSelectOption = {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  name: string
  options:
    | OptionsType<ReactSelectOption>
    | GroupedOptionsType<ReactSelectOption>
  id?: string
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  noOptionsMessage?: string
  onChange?: ((
    value: ValueType<ReactSelectOption>,
    actionMeta: ActionMeta<ReactSelectOption>,
  ) => void) &
    ((
      value: ValueType<ReactSelectOption>,
      action: ActionMeta<ReactSelectOption>,
    ) => void)
  label?: string
  value?: ValueType<ReactSelectOption>
  placeholder?: string
  defaultValue?: ReactSelectOption
  icon?: string
  isSearchable?: boolean
  size?: 'sm' | 'md'
  backgroundColor?: InputBackgroundColor
  required?: boolean
  ariaError?: AriaError
  formatGroupLabel?: formatGroupLabel<ReactSelectOption>
}

export const Menu = (props: MenuProps<ReactSelectOption>) => (
  <components.Menu className={styles.menu} {...props} />
)

export const Option = (props: OptionProps<ReactSelectOption>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.Option
      className={cn(styles.option, styles.optionSizes[size!])}
      {...props}
    />
  )
}

export const IndicatorsContainer = (
  props: IndicatorContainerProps<ReactSelectOption>,
) => {
  const { icon } = props.selectProps

  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.dontRotateIconOnOpen]: icon !== 'chevronDown',
      })}
      {...props}
    />
  )
}

export const DropdownIndicator = (props: IndicatorProps<ReactSelectOption>) => {
  const { icon, hasError } = props.selectProps

  return (
    <components.DropdownIndicator
      className={styles.dropdownIndicator}
      {...props}
    >
      <Icon
        icon={icon}
        size="large"
        color={hasError ? 'red600' : 'blue400'}
        className={styles.icon}
      />
    </components.DropdownIndicator>
  )
}

export const SingleValue = (props: SingleValueProps<ReactSelectOption>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.SingleValue
      className={cn(styles.singleValue, styles.singleValueSizes[size!])}
      {...props}
    />
  )
}

export const ValueContainer = (
  props: ValueContainerProps<ReactSelectOption>,
) => <components.ValueContainer className={styles.valueContainer} {...props} />

export const Placeholder = (props: PlaceholderProps<ReactSelectOption>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.Placeholder
      className={cn(
        styles.placeholder,
        styles.placeholderPadding,
        styles.placeholderSizes[size!],
      )}
      {...props}
    />
  )
}

export const Input: ComponentType<InputProps> = (
  props: InputProps & { selectProps?: Props<ReactSelectOption> },
) => {
  const ariaError = props?.selectProps?.ariaError
  const size = (props?.selectProps?.size || 'md') as SelectProps['size']
  return (
    <components.Input
      className={cn(styles.input, styles.inputSize[size!])}
      {...props}
      {...ariaError}
    />
  )
}

export const Control = (props: ControlProps<ReactSelectOption>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.Control
      className={cn(styles.container, styles.containerSizes[size!], {
        [styles.hasError]: props.selectProps.hasError,
      })}
      {...props}
    >
      <label
        htmlFor={props.selectProps.name}
        className={cn(styles.label, styles.labelSizes[size!])}
      >
        {props.selectProps.label}
        {props.selectProps.required && (
          <span aria-hidden="true" className={styles.isRequiredStar}>
            {' '}
            *
          </span>
        )}
      </label>
      {props.children}
    </components.Control>
  )
}

export const customStyles = {
  indicatorSeparator: () => ({}),
}
