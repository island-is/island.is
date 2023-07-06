import React from 'react'
import cn from 'classnames'
import ReactSelect, { createFilter } from 'react-select'
import CreatableReactSelect from 'react-select/creatable'

import { TestSupport } from '@island.is/island-ui/utils'

import {
  Option,
  Menu,
  IndicatorsContainer,
  Control,
  DropdownIndicator,
  Input,
  Placeholder,
  SingleValue,
  ValueContainer,
  customStyles,
} from './Components'
import {
  OptionValue,
  Option as OptionType,
  SelectProps,
  ReactSelectProps,
  AriaError,
} from './Select.types'
import * as styles from './Select.css'

export const Select = <Opt extends OptionType, Value extends OptionValue>({
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
  isCreatable = false,
  size = 'md',
  backgroundColor = 'white',
  required,
  formatGroupLabel,
  isClearable,
  dataTestId,
  filterConfig,
}: SelectProps<Opt, Value> & TestSupport) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}
  const [currentValue, setCurrentValue] = React.useState('')

  return isCreatable ? (
    <div
      className={cn(styles.wrapper, {
        [styles.wrapperColor[backgroundColor]]: !disabled,
        [styles.containerDisabled]: disabled,
      })}
      data-testid={`creatable-select-${name}`}
    >
      <CreatableReactSelect
        instanceId={id}
        aria-labelledby={id}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={disabled}
        styles={customStyles}
        classNamePrefix="island-select"
        isMulti={false}
        // We need to cast the onChange and options to the correct type
        // because we are not using multi select and that is a part of the onChange and options type
        onChange={onChange as ReactSelectProps['onChange']}
        options={options as ReactSelectProps['options']}
        label={label}
        value={value}
        icon={icon}
        dataTestId={dataTestId}
        placeholder={placeholder}
        defaultValue={defaultValue}
        isOptionDisabled={(option) => !!option.disabled}
        hasError={hasError}
        isSearchable={isSearchable}
        size={size}
        required={required}
        ariaError={ariaError as AriaError}
        formatGroupLabel={formatGroupLabel}
        formatCreateLabel={() => currentValue}
        createOptionPosition="first"
        onInputChange={(inputValue) => setCurrentValue(inputValue)}
        filterOption={createFilter(filterConfig)}
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
        isClearable
        backspaceRemovesValue
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  ) : (
    <div
      className={cn(styles.wrapper, {
        [styles.wrapperColor[backgroundColor]]: !disabled,
        [styles.containerDisabled]: disabled,
      })}
      data-testid={`select-${name}`}
    >
      <ReactSelect
        instanceId={id}
        aria-labelledby={id}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={disabled}
        styles={customStyles}
        classNamePrefix="island-select"
        isMulti={false}
        onChange={onChange as ReactSelectProps['onChange']}
        options={options as ReactSelectProps['options']}
        label={label}
        value={value}
        dataTestId={dataTestId}
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
        filterOption={createFilter(filterConfig)}
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
        isClearable={isClearable}
        backspaceRemovesValue={isClearable}
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
