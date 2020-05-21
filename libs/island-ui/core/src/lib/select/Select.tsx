import React from 'react'
import ReactSelect, { components } from 'react-select'
import cn from 'classnames'
import * as styles from './Select.treat'
import Icon from '../Icon/Icon'

type Option = { label: string; value: string | number }

export interface SelectProps {
  name: string
  id?: string
  disabled?: boolean
  options: Option[]
  noOptionsMessage?: string
  onChange?: (selected?: Option | Option[] | null) => void
  label?: string
  placeholder?: string
}

export const Select = ({
  name,
  id = name,
  disabled,
  noOptionsMessage,
  options,
  onChange,
  label,
  placeholder = '',
}: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <ReactSelect
        noOptionsMessage={() => noOptionsMessage}
        id={id}
        name={name}
        isDisabled={disabled}
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
        label={label}
        placeholder={placeholder}
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

const DropdownIndicator = (props) => (
  <components.DropdownIndicator className={styles.dropdownIndicator} {...props}>
    <Icon type="cheveron" width="25" />
  </components.DropdownIndicator>
)

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
