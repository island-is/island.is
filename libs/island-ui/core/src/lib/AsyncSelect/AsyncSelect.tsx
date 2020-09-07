import React from 'react'
import {
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
  OptionsType,
} from 'react-select'
import Async from 'react-select/async'
import cn from 'classnames'
import * as styles from './AsyncSelect.treat'
import Icon from '../Icon/Icon'

export type AsyncSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

export interface AsyncSelectProps {
  name: string
  id?: string
  disabled?: boolean
  options: AsyncSelectOption[]
  hasError?: boolean
  errorMessage?: string
  noOptionsMessage?: string
  onInputChange?: (str: string) => void
  loadOptions: (
    inputValue: string,
    callback: (options: OptionsType<AsyncSelectOption>) => void,
  ) => void | Promise<AsyncSelectOption[]>
  onChange?: ((
    value: ValueType<AsyncSelectOption>,
    actionMeta: ActionMeta<AsyncSelectOption>,
  ) => void) &
    ((
      value: ValueType<AsyncSelectOption>,
      action: ActionMeta<AsyncSelectOption>,
    ) => void)
  label?: string
  value?: ValueType<AsyncSelectOption>
  placeholder?: string
  defaultValue?: AsyncSelectOption
  icon?: string
}

export const AsyncSelect = ({
  name,
  id = name,
  disabled,
  noOptionsMessage,
  options,
  onChange,
  onInputChange,
  loadOptions,
  label,
  value,
  hasError = false,
  errorMessage = '',
  placeholder = '',
  defaultValue,
  icon = 'cheveron',
}: AsyncSelectProps) => {
  return (
    <div className={styles.wrapper}>
      <Async
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
        loadOptions={loadOptions}
        onInputChange={onInputChange}
        hasError={hasError}
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

const Menu = (props: MenuProps<AsyncSelectOption>) => (
  <components.Menu className={styles.menu} {...props} />
)
const Option = (props: OptionProps<AsyncSelectOption>) => (
  <components.Option className={styles.option} {...props} />
)

const IndicatorsContainer = (
  props: IndicatorContainerProps<AsyncSelectOption>,
) => (
  <components.IndicatorsContainer
    className={styles.indicatorsContainer}
    {...props}
  />
)

const DropdownIndicator = (props: IndicatorProps<AsyncSelectOption>) => {
  const { icon, hasError } = props.selectProps

  return (
    <components.DropdownIndicator
      className={styles.dropdownIndicator}
      {...props}
    >
      <Icon type={icon} width="25" color={hasError ? 'red400' : 'blue400'} />
    </components.DropdownIndicator>
  )
}

const SingleValue = (props: SingleValueProps<AsyncSelectOption>) => (
  <components.SingleValue className={styles.singleValue} {...props} />
)

const ValueContainer = (props: ValueContainerProps<AsyncSelectOption>) => (
  <components.ValueContainer className={styles.valueContainer} {...props} />
)

const Placeholder = (props: PlaceholderProps<AsyncSelectOption>) => (
  <components.Placeholder className={styles.placeholder} {...props} />
)

const Input = (props: InputProps) => (
  <components.Input className={styles.input} {...props} />
)

const Control = (props: ControlProps<AsyncSelectOption>) => {
  return (
    <components.Control
      className={cn(styles.container, {
        [styles.containerDisabled]: props.isDisabled,
        [styles.hasError]: props.selectProps.hasError,
      })}
      {...props}
    >
      <label htmlFor={props.selectProps.name} className={styles.label}>
        {props.selectProps.label}
      </label>
      {props.children}
    </components.Control>
  )
}

export default AsyncSelect
