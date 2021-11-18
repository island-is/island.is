import React, { ComponentType } from 'react'
import cn from 'classnames'
import ReactSelect, {
  components,
  ValueType,
  ActionMeta,
  MenuProps,
  OptionProps,
  IndicatorContainerProps,
  IndicatorProps,
  SingleValueProps,
  ValueContainerProps,
  PlaceholderProps,
  InputProps,
  ControlProps,
  Props,
  OptionsType,
  GroupedOptionsType,
} from 'react-select'
import { formatGroupLabel } from 'react-select/src/builtins'
import * as styles from './Select.css'
import { Icon } from '../IconRC/Icon'
import { InputBackgroundColor } from '../Input/types'

export type Option = {
  label: string
  value: string | number
  disabled?: boolean
}

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export interface SelectProps {
  name: string
  options: OptionsType<Option> | GroupedOptionsType<Option>
  id?: string
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  noOptionsMessage?: string
  onChange?: ((
    value: ValueType<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void) &
    ((value: ValueType<Option>, action: ActionMeta<Option>) => void)
  label?: string
  value?: ValueType<Option>
  placeholder?: string
  defaultValue?: Option
  icon?: string
  isSearchable?: boolean
  size?: 'xs' | 'sm' | 'md'
  backgroundColor?: InputBackgroundColor
  required?: boolean
  ariaError?: AriaError
  formatGroupLabel?: formatGroupLabel<Option>
}

export const Select = ({
  name,
  id = name,
  disabled,
  noOptionsMessage,
  options,
  onChange,
  label,
  value,
  hasError = false,
  errorMessage = '',
  placeholder = '',
  defaultValue,
  icon = 'chevronDown',
  isSearchable = true,
  size = 'md',
  backgroundColor = 'white',
  required,
  formatGroupLabel,
}: SelectProps) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

  return (
    <div
      className={cn(styles.wrapper, styles.wrapperColor[backgroundColor])}
      data-testid={`select-${name}`}
    >
      <ReactSelect
        instanceId={id}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={disabled}
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
        label={label}
        value={value}
        icon={icon}
        placeholder={placeholder}
        defaultValue={defaultValue}
        isOptionDisabled={(option) => !!option.disabled}
        hasError={hasError}
        isSearchable={isSearchable}
        size={size}
        required={required}
        ariaError={ariaError as AriaError}
        formatGroupLabel={formatGroupLabel}
        components={{
          Control,
          Input,
          Placeholder,
          ValueContainer,
          SingleValue,
          DropdownIndicator,
          IndicatorsContainer,
          Menu,
          Option,
        }}
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

const customStyles = {
  indicatorSeparator: () => ({}),
}

const Menu = (props: MenuProps<Option>) => (
  <components.Menu className={styles.menu} {...props} />
)
const Option = (props: OptionProps<Option>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.Option
      className={cn(styles.option, styles.optionSizes[size!])}
      {...props}
    />
  )
}

const IndicatorsContainer = (props: IndicatorContainerProps<Option>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'

  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.indicatorsContainerExtraSmall]: size === 'xs',
      })}
      {...props}
    />
  )
}

const DropdownIndicator = (props: IndicatorProps<Option>) => {
  const { icon, hasError } = props.selectProps
  const size: SelectProps['size'] = props.selectProps.size || 'md'

  return (
    <components.DropdownIndicator
      className={styles.dropdownIndicator}
      {...props}
    >
      <Icon
        icon={icon}
        size="large"
        color={hasError ? 'red600' : 'blue400'}
        className={cn(styles.icon, {
          [styles.iconExtraSmall]: size === 'xs',
        })}
      />
    </components.DropdownIndicator>
  )
}

const SingleValue = (props: SingleValueProps<Option>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.SingleValue
      className={cn(styles.singleValue, styles.singleValueSizes[size!])}
      {...props}
    />
  )
}

const ValueContainer = (props: ValueContainerProps<Option>) => (
  <components.ValueContainer className={styles.valueContainer} {...props} />
)

const Placeholder = (props: PlaceholderProps<Option>) => {
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

const Input: ComponentType<InputProps> = (
  props: InputProps & { selectProps?: Props<Option> },
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

const Control = (props: ControlProps<Option>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'

  // If size is xs then the label is above the select box
  if (size === 'xs') {
    return (
      <>
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
        <components.Control
          className={cn(styles.container, styles.containerSizes[size!], {
            [styles.hasError]: props.selectProps.hasError,
          })}
          {...props}
        >
          {props.children}
        </components.Control>
      </>
    )
  }
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
