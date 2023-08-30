import React, { ReactNode } from 'react'
import cn from 'classnames'
import {
  components,
  MenuProps,
  OptionProps,
  IndicatorsContainerProps,
  ControlProps,
  InputProps,
  PlaceholderProps,
  ValueContainerProps,
  SingleValueProps,
  StylesConfig,
  DropdownIndicatorProps,
  GroupBase,
} from 'react-select'

import { Icon } from '../../IconRC/Icon'
import { Option as OptionType } from '../Select.types'
import * as styles from '../Select.css'

export const Menu = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: MenuProps<OptionType<Value>, IsMulti, Group>,
) => (
  <components.Menu className={styles.menu} {...props}>
    {props.children}
  </components.Menu>
)

export const Option = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: OptionProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  const description = props.data?.description
  // Truncate description by default
  const descriptionTruncated =
    !!description && props.data?.descriptionTruncated !== false

  return (
    <components.Option
      className={cn(styles.option, styles.optionSizes[size])}
      {...props}
    >
      <>
        {props.children}
        {!!description && (
          <div
            data-testid={props.selectProps?.dataTestId}
            className={cn(
              styles.optionDescription,
              styles.optionDescriptionSizes[size],
              { [styles.optionDescriptionTruncated]: descriptionTruncated },
            )}
          >
            {description}
          </div>
        )}
      </>
    </components.Option>
  )
}

export const IndicatorsContainer = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: IndicatorsContainerProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { icon, size = 'md' } = props.selectProps
  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.dontRotateIconOnOpen]: icon !== 'chevronDown',
        [styles.indicatorsContainerExtraSmall]: size === 'xs',
      })}
      {...props}
    >
      {props.children}
    </components.IndicatorsContainer>
  )
}

export const DropdownIndicator = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: DropdownIndicatorProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { icon = 'chevronDown', hasError, size = 'md' } = props.selectProps

  return (
    <components.DropdownIndicator
      className={styles.dropdownIndicator}
      {...props}
    >
      <Icon
        icon={icon}
        size="large"
        color={hasError ? 'red600' : 'blue400'}
        className={cn(styles.icon, {
          [styles.iconExtraSmall]: size === 'xs',
        })}
      />
    </components.DropdownIndicator>
  )
}

export const SingleValue = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: SingleValueProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  return (
    <components.SingleValue
      className={cn(styles.singleValue, styles.singleValueSizes[size])}
      {...props}
    >
      {props.children}
    </components.SingleValue>
  )
}

export const ValueContainer = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: ValueContainerProps<OptionType<Value>, IsMulti, Group>,
) => (
  <components.ValueContainer className={styles.valueContainer} {...props}>
    {props.children}
  </components.ValueContainer>
)

export const Placeholder = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: PlaceholderProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  return (
    <components.Placeholder
      className={cn(
        styles.placeholder,
        styles.placeholderPadding,
        styles.placeholderSizes[size],
      )}
      {...props}
    >
      {props.children}
    </components.Placeholder>
  )
}

export const Input = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: InputProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md', ariaError } = props.selectProps
  return (
    <components.Input
      className={styles.inputContainer}
      inputClassName={styles.input}
      {...props}
      {...ariaError}
      data-testid={props?.selectProps?.dataTestId}
      role="combobox"
    />
  )
}
export const Control = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: ControlProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  const label = (
    <label
      htmlFor={props.selectProps.name}
      className={cn(styles.label, styles.labelSizes[size], {
        [styles.labelDisabled]: props.selectProps.isDisabled,
      })}
    >
      {props.selectProps.label}
      {props.selectProps.required && (
        <span aria-hidden="true" className={styles.isRequiredStar}>
          {' '}
          *
        </span>
      )}
    </label>
  )

  const component = (label?: ReactNode) => {
    return (
      <components.Control
        className={cn(styles.container, styles.containerSizes[size], {
          [styles.hasError]: props.selectProps.hasError,
        })}
        {...props}
      >
        {label && label}
        {props.children}
      </components.Control>
    )
  }
  if (size === 'xs') {
    return (
      <>
        {label} {component()}
      </>
    )
  } else {
    return component(label)
  }
}

export const customStyles = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(): StylesConfig<OptionType<Value>, IsMulti, Group> => ({
  indicatorSeparator: () => ({}),
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    opacity: state.isDisabled ? '0.5' : '1',
  }),
})
