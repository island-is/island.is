import React from 'react'
import cn from 'classnames'
import ReactSelect, {
  OptionsType,
  GroupedOptionsType,
  ActionMeta,
  ValueType,
  createFilter,
} from 'react-select'
import { Config } from 'react-select/src/filters'
import CreatableReactSelect from 'react-select/creatable'
import { formatGroupLabel } from 'react-select/src/builtins'
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
import { InputBackgroundColor } from '../Input/types'
import * as styles from './Select.css'
import { TestSupport } from '@island.is/island-ui/utils'

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export type Option = {
  label: string
  value: string | number
  description?: string
  descriptionTruncated?: boolean
  disabled?: boolean
}

export interface SelectProps {
  name: string
  options: OptionsType<Option> | GroupedOptionsType<Option>
  id?: string
  disabled?: boolean
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
  size?: 'xs' | 'sm' | 'md'
  isCreatable?: boolean
  backgroundColor?: InputBackgroundColor
  required?: boolean
  ariaError?: AriaError
  formatGroupLabel?: formatGroupLabel<Option>
  isClearable?: boolean
  filterConfig?: Config | null
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
  isCreatable = false,
  size = 'md',
  backgroundColor = 'white',
  required,
  formatGroupLabel,
  isClearable,
  dataTestId,
  filterConfig = null,
}: SelectProps & TestSupport) => {
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
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
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
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
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
