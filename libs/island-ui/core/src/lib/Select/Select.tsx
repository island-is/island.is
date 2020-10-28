import React, { ComponentType } from 'react'
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
} from 'react-select'
import cn from 'classnames'
import * as styles from './Select.treat'
import { Icon } from '../IconRC/Icon'
import { InputBackgroundColor } from '../Input/Input'

export type Option = {
  label: string
  value: string | number
  disabled?: boolean
}
export interface SelectProps {
  name: string
  id?: string
  disabled?: boolean
  options: Option[]
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
  size?: 'sm' | 'md'
  backgroundColor?: InputBackgroundColor
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
}: SelectProps) => {
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
        <div className={styles.errorMessage} id={id}>
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

const IndicatorsContainer = (props: IndicatorContainerProps<Option>) => (
  <components.IndicatorsContainer
    className={styles.indicatorsContainer}
    {...props}
  />
)

const DropdownIndicator = (props: IndicatorProps<Option>) => {
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
  const size = (props?.selectProps?.size || 'md') as SelectProps['size']
  return (
    <components.Input
      className={cn(styles.input, styles.inputSize[size!])}
      {...props}
    />
  )
}

const Control = (props: ControlProps<Option>) => {
  const size: SelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.Control
      className={cn(styles.container, styles.containerSizes[size!], {
        [styles.containerDisabled]: props.isDisabled,
        [styles.hasError]: props.selectProps.hasError,
      })}
      {...props}
    >
      <label
        htmlFor={props.selectProps.name}
        className={cn(styles.label, styles.labelSizes[size!])}
      >
        {props.selectProps.label}
      </label>
      {props.children}
    </components.Control>
  )
}
