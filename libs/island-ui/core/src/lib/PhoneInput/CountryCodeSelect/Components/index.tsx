import React from 'react'
import cn from 'classnames'
import {
  components,
  MenuProps,
  OptionProps,
  ControlProps,
  InputProps,
  PlaceholderProps,
  ValueContainerProps,
  SingleValueProps,
  StylesConfig,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  IndicatorsContainerProps,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  GroupBase,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  DropdownIndicatorProps,
} from 'react-select'

import { Box } from '../../../Box/Box'
import { Icon } from '../../../IconRC/Icon'
import { Option as OptionType } from '../../../Select/Select.types'

import * as styles from '../CountryCodeSelect.css'

export const Menu = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: MenuProps<OptionType<string>, false, GroupBase<OptionType<string>>>,
) => (
  <components.Menu className={styles.menu} {...props}>
    {props.children}
  </components.Menu>
)

export const Option = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: OptionProps<OptionType<string>, false, GroupBase<OptionType<string>>>,
) => {
  const { size = 'md' } = props.selectProps
  const description = props.data?.description // Flag in this case

  return (
    <components.Option
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      className={cn(styles.option, styles.optionSizes[size])}
      {...props}
    >
      <Box display="flex" alignItems="center">
        <span className={styles.optionFlag}>{description}</span>
        <div>{props.children}</div>
      </Box>
    </components.Option>
  )
}

export const IndicatorsContainer = (
  props: IndicatorsContainerProps<
    OptionType<string>,
    false,
    GroupBase<OptionType<string>>
  >,
) => {
  const {
    icon,
    size = 'md',
    isDisabled = false,
    inputHasLabel,
  } = props.selectProps

  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.dontRotateIconOnOpen]: icon !== 'chevronDown',
        [styles.indicatorsContainerExtraSmall]: size === 'xs',
        [styles.indicatorContainerWithLabel]: inputHasLabel,
        [styles.indicatorsContainerDisabled]: isDisabled,
      })}
      {...props}
    >
      {props.children}
    </components.IndicatorsContainer>
  )
}

export const DropdownIndicator = (
  props: DropdownIndicatorProps<
    OptionType<string>,
    false,
    GroupBase<OptionType<string>>
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: SingleValueProps<
    OptionType<string>,
    false,
    GroupBase<OptionType<string>>
  >,
) => {
  const { size = 'md' } = props.selectProps
  const value = props.hasValue ? props.getValue() : null
  return (
    <components.SingleValue
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      className={cn(styles.singleValue, styles.singleValueSizes[size])}
      {...props}
    >
      {value ? value[0].value : ''}
    </components.SingleValue>
  )
}

export const ValueContainer = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: ValueContainerProps<
    OptionType<string>,
    false,
    GroupBase<OptionType<string>>
  >,
) => {
  const { inputHasLabel, size } = props.selectProps
  return (
    <components.ValueContainer
      className={cn({
        [styles.valueContainer({
          size,
        })]: !!inputHasLabel,
        [styles.valueContainerSmall]: size === 'sm',
      })}
      {...props}
    >
      {props.children}
    </components.ValueContainer>
  )
}

export const Placeholder = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: PlaceholderProps<
    OptionType<string>,
    false,
    GroupBase<OptionType<string>>
  >,
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

export const Input = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: InputProps<OptionType<string>, false, GroupBase<OptionType<string>>>,
) => {
  const { ariaError } = props.selectProps
  return (
    <components.Input
      className={styles.inputContainer}
      inputClassName={styles.input}
      {...props}
      {...ariaError}
      data-testid={props?.selectProps?.dataTestId}
      role="combobox"
      autoComplete="none"
    />
  )
}
export const Control = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  props: ControlProps<OptionType<string>, false, GroupBase<OptionType<string>>>,
) => {
  const { size = 'md' } = props.selectProps
  return (
    <components.Control
      className={cn(styles.container, {
        [styles.hasError]: props.selectProps.hasError,
        [styles.containerXS]: size === 'xs',
      })}
      {...props}
    >
      {props.children}
    </components.Control>
  )
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
export const customStyles = (): StylesConfig<
  OptionType<string>,
  false,
  GroupBase<OptionType<string>>
> => ({
  indicatorSeparator: () => ({}),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  container: (provided) => ({
    ...provided,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    width: '140px',
    opacity: state.isDisabled ? '0.5' : '1',
  }),
})
