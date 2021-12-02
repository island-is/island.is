import React from 'react'
import cn from 'classnames'
import ReactSelect from 'react-select'
import {
  Option,
  Menu,
  SelectProps,
  IndicatorsContainer,
  Control,
  DropdownIndicator,
  Input,
  Placeholder,
  SingleValue,
  ValueContainer,
  customStyles,
} from './Components'
import * as styles from './Select.css'

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
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
