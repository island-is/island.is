import React from 'react'
import ReactSelect, { components } from 'react-select'
import styles from './Select.module.scss'
import Icon from '../icon/Icon'

type Option = { label: string; value: string | number }

export interface SelectProps {
  options: Option[]
  onChange?: (selected?: Option | Option[] | null) => void
  label?: string
  placeholder?: string
}

export const Select = ({
  options,
  onChange,
  label,
  placeholder = '',
}: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <ReactSelect
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
    <components.Control className={styles.container} {...props}>
      <label htmlFor={props.name} className={styles.label}>
        {props.selectProps.label}
      </label>
      {props.children}
    </components.Control>
  )
}

export default Select
