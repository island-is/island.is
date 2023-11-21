import React from 'react'
import cn from 'classnames'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import ReactSelect, { createFilter, GroupBase } from 'react-select'
import CreatableReactSelect from 'react-select/creatable'

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
import { Option as OptionType, SelectProps } from './Select.types'

import * as styles from './Select.css'

export const Select = <
  Value,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType<Value>> = GroupBase<OptionType<Value>>,
>({
  name,
  id = name,
  isDisabled,
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
}: SelectProps<OptionType<Value>, IsMulti, Group>) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : undefined
  const [currentValue, setCurrentValue] = React.useState('')

  return isCreatable ? (
    <div
      className={cn(styles.wrapper, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        [styles.wrapperColor[backgroundColor]]: !isDisabled,
        [styles.containerDisabled]: isDisabled,
      })}
      data-testid={`creatable-select-${name}`}
    >
      {/**
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict*/}
      <CreatableReactSelect<OptionType<Value>, IsMulti, Group>
        instanceId={id}
        aria-labelledby={id}
        ariaError={ariaError}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={isDisabled}
        styles={customStyles()}
        classNamePrefix="island-select"
        onChange={onChange}
        options={options}
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
        menuShouldScrollIntoView={false}
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        [styles.wrapperColor[backgroundColor]]: !isDisabled,
        [styles.containerDisabled]: isDisabled,
      })}
      data-testid={`select-${name}`}
    >
      {/**
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict*/}
      <ReactSelect<OptionType<Value>, IsMulti, Group>
        instanceId={id}
        aria-labelledby={id}
        ariaError={ariaError}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={isDisabled}
        styles={customStyles()}
        classNamePrefix="island-select"
        onChange={onChange}
        options={options}
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
        menuShouldScrollIntoView={false}
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
