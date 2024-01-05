import React from 'react'
import cn from 'classnames'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
import ReactSelect, { GroupBase } from 'react-select'

import { Option as OptionType } from '../../Select/Select.types'
import { CountryCodeSelectProps } from '../PhoneInput.types'
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

import * as styles from './CountryCodeSelect.css'

export const CountryCodeSelect = ({
  name,
  id = name,
  isDisabled,
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
}: CountryCodeSelectProps) => {
  return (
    <div
      className={cn(styles.wrapper, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        [styles.wrapperColor[backgroundColor]]: !isDisabled,
        [styles.containerDisabled]: isDisabled,
      })}
      data-testid={`country-code-select-${name}`}
    >
      {/**
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict*/}
      <ReactSelect<OptionType<string>, false, GroupBase<OptionType<string>>>
        instanceId={id}
        aria-labelledby={id}
        id={id}
        name={name}
        isDisabled={isDisabled}
        onChange={onChange}
        options={options}
        value={value}
        icon="chevronDown"
        classNamePrefix="country-code-select"
        styles={customStyles()}
        onFocus={onFocus}
        onBlur={onBlur}
        onMenuOpen={onMenuOpen}
        onMenuClose={onMenuClose}
        dataTestId={dataTestId}
        placeholder={placeholder}
        defaultValue={defaultValue}
        inputHasLabel={inputHasLabel}
        size={size}
        unstyled
        menuShouldScrollIntoView={false}
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
