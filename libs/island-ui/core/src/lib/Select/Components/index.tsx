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
import { Option as ReactSelectOption } from '../Select.types'
import * as styles from '../Select.css'

export const Menu = (
  props: MenuProps<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>,
) => (
  <components.Menu className={styles.menu} {...props}>
    {props.children}
  </components.Menu>
)

export const Option = (
  props: OptionProps<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>,
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

export const IndicatorsContainer = (
  props: IndicatorsContainerProps<
    ReactSelectOption,
    boolean,
    GroupBase<ReactSelectOption>
  >,
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

export const DropdownIndicator = (
  props: DropdownIndicatorProps<
    ReactSelectOption,
    boolean,
    GroupBase<ReactSelectOption>
  >,
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

export const SingleValue = (
  props: SingleValueProps<
    ReactSelectOption,
    boolean,
    GroupBase<ReactSelectOption>
  >,
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

export const ValueContainer = (
  props: ValueContainerProps<
    ReactSelectOption,
    boolean,
    GroupBase<ReactSelectOption>
  >,
) => (
  <components.ValueContainer className={styles.valueContainer} {...props}>
    {props.children}
  </components.ValueContainer>
)

export const Placeholder = (
  props: PlaceholderProps<
    ReactSelectOption,
    boolean,
    GroupBase<ReactSelectOption>
  >,
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

export const Input = (
  props: InputProps<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>,
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
export const Control = (
  props: ControlProps<ReactSelectOption, boolean, GroupBase<ReactSelectOption>>,
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

export const customStyles: StylesConfig<
  ReactSelectOption,
  boolean,
  GroupBase<ReactSelectOption>
> = {
  indicatorSeparator: () => ({}),
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    opacity: state.isDisabled ? '0.5' : '1',
  }),
}
