import React, { ComponentType } from 'react'
import cn from 'classnames'
import {
  components,
  MenuProps,
  OptionProps,
  IndicatorContainerProps,
  ControlProps,
  InputProps,
  PlaceholderProps,
  ValueContainerProps,
  SingleValueProps,
  IndicatorProps,
  Props,
  StylesConfig,
} from 'react-select'
import { Icon } from '../../../IconRC/Icon'
import * as styles from '../CountryCodeSelect.css'
import { CountryCodeSelectProps } from '../../PhoneInput.types'
import { Option as ReactSelectOption } from '../../../Select/Select'
import { Box } from '../../../Box/Box'

export const Menu = (props: MenuProps<ReactSelectOption>) => (
  <components.Menu className={styles.menu} {...props} />
)

type NonNullableSize = NonNullable<CountryCodeSelectProps['size']>

export const Option = (props: OptionProps<ReactSelectOption>) => {
  const size: NonNullableSize = props.selectProps.size || 'md'
  const description = props.data?.description // Flag in this case

  return (
    <components.Option
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
  props: IndicatorContainerProps<ReactSelectOption>,
) => {
  const { icon } = props.selectProps
  const size: CountryCodeSelectProps['size'] = props.selectProps.size || 'md'
  const hasLabel: boolean = props.selectProps.inputHasLabel
  const disabled: boolean = props.selectProps.isDisabled ?? false
  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.dontRotateIconOnOpen]: icon !== 'chevronDown',
        [styles.indicatorsContainerExtraSmall]: size === 'xs',
        [styles.indicatorContainerWithLabel]: hasLabel,
        [styles.indicatorsContainerDisabled]: disabled,
      })}
      {...props}
    />
  )
}

export const DropdownIndicator = (props: IndicatorProps<ReactSelectOption>) => {
  const { icon, hasError } = props.selectProps
  const size: CountryCodeSelectProps['size'] = props.selectProps.size || 'md'

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

export const SingleValue = (props: SingleValueProps<ReactSelectOption>) => {
  const size: NonNullableSize = props.selectProps.size || 'md'
  const hasLabel: boolean = props.selectProps.inputHasLabel
  const value = (props.hasValue ? props.getValue() : null) as
    | ReactSelectOption[]
    | null
  return (
    <components.SingleValue
      className={cn(styles.singleValue, styles.singleValueSizes[size], {
        [styles.singleValuePushTop]: hasLabel,
      })}
      {...props}
    >
      {value ? value[0].value : ''}
    </components.SingleValue>
  )
}

export const ValueContainer = (
  props: ValueContainerProps<ReactSelectOption>,
) => {
  const hasLabel: boolean = props.selectProps.inputHasLabel
  return (
    <components.ValueContainer
      className={cn({ [styles.valueContainer]: hasLabel })}
      {...props}
    />
  )
}

export const Placeholder = (props: PlaceholderProps<ReactSelectOption>) => {
  const size: NonNullableSize = props.selectProps.size || 'md'
  return (
    <components.Placeholder
      className={cn(
        styles.placeholder,
        styles.placeholderPadding,
        styles.placeholderSizes[size],
      )}
      {...props}
    />
  )
}

export const Input: ComponentType<InputProps> = (
  props: InputProps & { selectProps?: Props<ReactSelectOption> },
) => {
  const ariaError = props?.selectProps?.ariaError
  const size = (props?.selectProps?.size || 'md') as NonNullableSize
  return (
    <components.Input
      className={cn(styles.input, styles.inputSize[size])}
      {...props}
      {...ariaError}
      data-testid={props?.selectProps?.dataTestId}
      role="combobox"
      autoComplete="none"
    />
  )
}
export const Control = (props: ControlProps<ReactSelectOption>) => {
  const size = (props?.selectProps?.size || 'md') as NonNullableSize
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

export const customStyles: StylesConfig = {
  indicatorSeparator: () => ({}),
  container: (provided) => ({
    ...provided,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  }),
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    width: '140px',
    opacity: state.isDisabled ? '0.5' : '1',
  }),
}
