import React from 'react'
import { TestSupport } from '@island.is/island-ui/utils'
import ReactSelect from 'react-select'
import cn from 'classnames'
import { CountryCodeSelectProps } from '../PhoneInput.types'
import * as styles from './CountryCodeSelect.css'
import {
  Option as OptionComponent,
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

export const CountryCodeSelect = ({
  name,
  id = name,
  disabled,
  options,
  value,
  placeholder = '',
  defaultValue,
  size = 'md',
  backgroundColor = 'white',
  dataTestId,
  inputHasLabel,
  onChange,
  onFocus,
  onBlur,
  onMenuOpen,
  onMenuClose,
}: CountryCodeSelectProps & TestSupport) => {
  return (
    <div
      className={cn(styles.wrapper, {
        [styles.wrapperColor[backgroundColor]]: !disabled,
        [styles.containerDisabled]: disabled,
      })}
      data-testid={`country-code-select-${name}`}
    >
      <ReactSelect
        instanceId={id}
        aria-labelledby={id}
        id={id}
        name={name}
        isDisabled={disabled}
        onChange={onChange}
        value={value}
        options={options}
        icon="chevronDown"
        classNamePrefix="country-code-select"
        styles={customStyles}
        onFocus={onFocus}
        onBlur={onBlur}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        dataTestId={dataTestId}
        placeholder={placeholder}
        defaultValue={defaultValue}
        inputHasLabel={inputHasLabel}
        size={size}
        components={{
          Control,
          Input,
          Placeholder,
          ValueContainer,
          SingleValue,
          DropdownIndicator,
          IndicatorsContainer,
          Menu,
          Option: OptionComponent,
        }}
      />
    </div>
  )
}
