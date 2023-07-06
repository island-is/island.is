import React from 'react'
import cn from 'classnames'
import ReactSelect from 'react-select'

import { TestSupport } from '@island.is/island-ui/utils'
import {
  Option as OptionType,
  OptionValue,
  ReactSelectProps,
} from '../../Select/Select.types'
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

export const CountryCodeSelect = <
  Opt extends OptionType,
  Value extends OptionValue
>({
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
}: CountryCodeSelectProps<Opt, Value> & TestSupport) => {
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
        isMulti={false}
        // We need to cast the onChange and options to the correct type
        // because we are not using multi select and that is a part of the onChange and options type
        onChange={onChange as ReactSelectProps['onChange']}
        options={options as ReactSelectProps['options']}
        value={value}
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
