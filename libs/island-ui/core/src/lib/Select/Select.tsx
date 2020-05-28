import React from 'react'
import ReactSelect, { components, ValueType, ActionMeta } from 'react-select'
import cn from 'classnames'
import * as styles from './Select.treat'
import Icon from '../Icon/Icon'

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
  icon = 'cheveron',
}: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <ReactSelect
        instanceId={id}
        noOptionsMessage={() => noOptionsMessage}
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
        isOptionDisabled={(option) => option.disabled}
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

const Menu = (props) => <components.Menu className={styles.menu} {...props} />
const Option = (props) => (
  <components.Option className={styles.option} {...props} />
)

const IndicatorsContainer = (props) => (
  <components.IndicatorsContainer
    className={styles.indicatorsContainer}
    {...props}
  />
)

const DropdownIndicator = (props) => {
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

const SingleValue = (props) => (
  <components.SingleValue className={styles.singleValue} {...props} />
)

const ValueContainer = (props) => (
  <components.ValueContainer className={styles.valueContainer} {...props} />
)

const Placeholder = (props) => (
  <components.Placeholder className={styles.placeholder} {...props} />
)

const Input = (props) => (
  <components.Input className={styles.input} {...props} />
)

const Control = (props) => {
  return (
    <components.Control
      className={cn(styles.container, {
        [styles.containerDisabled]: props.isDisabled,
        [styles.hasError]: props.selectProps.hasError,
      })}
      {...props}
    >
      <label htmlFor={props.name} className={styles.label}>
        {props.selectProps.label}
      </label>
      {props.children}
    </components.Control>
  )
}

export default Select
