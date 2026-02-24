import React, { ReactNode } from 'react'
import cn from 'classnames'
import {
  components,
  MenuProps,
  OptionProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  IndicatorsContainerProps,
  ControlProps,
  InputProps,
  PlaceholderProps,
  ValueContainerProps,
  SingleValueProps,
  StylesConfig,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  DropdownIndicatorProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  GroupBase,
  MultiValueProps,
  MultiValueGenericProps,
  ClearIndicatorProps,
} from 'react-select'

import { Icon } from '../../IconRC/Icon'
import { Text } from '../../Text/Text'
import { Option as OptionType } from '../Select.types'
import * as styles from '../Select.css'
import { Box } from '../../Box/Box'

export const MultiValue = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<Value>,
>(
  props: MultiValueProps<Value, IsMulti, Group>,
) => {
  return (
    <components.MultiValue className={styles.multiValue} {...props}>
      {props.children}
    </components.MultiValue>
  )
}

export const MultiValueLabel = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<Value>,
>(
  props: MultiValueGenericProps<Value, IsMulti, Group>,
) => {
  return (
    <components.MultiValueLabel {...props}>
      <span className={styles.multiValueLabel}>{props.children}</span>
    </components.MultiValueLabel>
  )
}

export const Menu = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: OptionProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps

  const description = props.data?.description
  // Truncate description by default
  const descriptionTruncated =
    !!description && props.data?.descriptionTruncated !== false

  const showCheckmark = props.data?.withCheckmark

  return (
    <components.Option
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      className={cn(
        size === 'xs' ? styles.optionExtraSmall : styles.option,
        styles.optionSizes[size],
      )}
      {...props}
    >
      <>
        {showCheckmark && (
          <>
            <input
              type="checkbox"
              checked={props.isSelected && props.data?.isSelected}
              onChange={() => null}
              className={cn(styles.inputCheckbox)}
            />
            <div
              className={cn(styles.checkbox, {
                [styles.checkboxChecked]:
                  props.isSelected && props.data?.isSelected,
              })}
            >
              <Icon
                icon="checkmark"
                color={
                  props.isSelected && props.data?.isSelected
                    ? 'white'
                    : 'transparent'
                }
                ariaHidden
              />
            </div>
          </>
        )}
        <Box display="flex" flexDirection="column">
          {props.children}
          {!!description && (
            <div
              data-testid={props.selectProps?.dataTestId}
              className={cn(
                styles.optionDescription,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                styles.optionDescriptionSizes[size],
                { [styles.optionDescriptionTruncated]: descriptionTruncated },
              )}
            >
              {description}
            </div>
          )}
        </Box>
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: SingleValueProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  return (
    <components.SingleValue
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: ValueContainerProps<OptionType<Value>, IsMulti, Group>,
) => (
  <components.ValueContainer
    className={cn(
      styles.valueContainer,
      props.isMulti && styles.multiValueContainer,
    )}
    {...props}
  >
    {props.children}
  </components.ValueContainer>
)

export const Placeholder = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: PlaceholderProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  return (
    <components.Placeholder
      className={cn(
        styles.placeholder,
        styles.placeholderPadding,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: ControlProps<OptionType<Value>, IsMulti, Group>,
) => {
  const { size = 'md' } = props.selectProps
  const label = (
    <label
      htmlFor={props.selectProps.name}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
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

export const ClearIndicator = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
>(
  props: ClearIndicatorProps<OptionType<Value>, IsMulti, Group>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon icon="close" color="blue400" />
    </components.ClearIndicator>
  )
}

export const customStyles = <
  Value,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType<Value>>,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
>(): StylesConfig<OptionType<Value>, IsMulti, Group> => ({
  indicatorSeparator: () => ({}),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    opacity: state.isDisabled ? '0.5' : '1',
  }),
})

export const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <Text>{props.children}</Text>
    </components.NoOptionsMessage>
  )
}
