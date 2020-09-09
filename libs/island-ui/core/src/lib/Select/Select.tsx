import React from 'react'
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
} from 'react-select'
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
const Option = (props: OptionProps<Option>) => (
  <components.Option className={styles.option} {...props} />
)

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
      <Icon type={icon} width="22" color={hasError ? 'red400' : 'blue400'} />
    </components.DropdownIndicator>
  )
}

const SingleValue = (props: SingleValueProps<Option>) => (
  <components.SingleValue className={styles.singleValue} {...props} />
)

const ValueContainer = (props: ValueContainerProps<Option>) => (
  <components.ValueContainer className={styles.valueContainer} {...props} />
)

const Placeholder = (props: PlaceholderProps<Option>) => (
  <components.Placeholder className={styles.placeholder} {...props} />
)

const Input = (props: InputProps) => (
  <components.Input className={styles.input} {...props} />
)

const Control = (props: ControlProps<Option>) => {
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

export default Select
