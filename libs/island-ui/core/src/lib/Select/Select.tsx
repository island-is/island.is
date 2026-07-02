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
  MultiValue,
  MultiValueLabel,
  customStyles,
  NoOptionsMessage,
  ClearIndicator,
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
  isMulti,
  closeMenuOnSelect = !isMulti,
  size = 'md',
  backgroundColor = 'white',
  required,
  formatGroupLabel,
  isClearable,
  dataTestId,
  filterConfig,
  filterOption,
  isLoading = false,
  hideSelectedOptions,
  onMenuOpen,
  onMenuClose,
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
        isLoading={isLoading}
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
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
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
          MultiValue,
          MultiValueLabel,
          ClearIndicator,
          NoOptionsMessage,
        }}
        isClearable
        backspaceRemovesValue
        menuShouldScrollIntoView={false}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
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
      <ReactSelect<OptionType<Value>, IsMulti, Group>
        instanceId={id}
        aria-labelledby={id}
        ariaError={ariaError}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        isLoading={isLoading}
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
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        defaultValue={defaultValue}
        isOptionDisabled={(option) => !!option.disabled}
        hasError={hasError}
        isSearchable={isSearchable}
        size={size}
        required={required}
        formatGroupLabel={formatGroupLabel}
        filterOption={filterOption ?? createFilter(filterConfig)}
        hideSelectedOptions={hideSelectedOptions}
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
          MultiValue,
          MultiValueLabel,
          ClearIndicator,
          NoOptionsMessage,
        }}
        isClearable={isClearable}
        backspaceRemovesValue={isClearable}
        menuShouldScrollIntoView={false}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
