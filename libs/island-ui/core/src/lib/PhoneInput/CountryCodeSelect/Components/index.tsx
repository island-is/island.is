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
import { labelSizes } from '../../../Input/Input.mixins'

export const Menu = (props: MenuProps<ReactSelectOption>) => (
  <components.Menu className={styles.menu} {...props} />
)

type NonNullableSize = NonNullable<CountryCodeSelectProps['size']>

export const Option = (props: OptionProps<ReactSelectOption>) => {
  const size: NonNullableSize = props.selectProps.size || 'md'
  const description = props.data?.description
  // Truncate description by default
  const descriptionTruncated =
    !!description && props.data?.descriptionTruncate !== false

  return (
    <components.Option
      className={cn(styles.option, styles.optionSizes[size])}
      {...props}
    >
      <>
        {props.children}
        {!!description && (
          <div
            data-testid={props.data?.dataTestId}
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
  props: IndicatorContainerProps<ReactSelectOption>,
) => {
  const { icon } = props.selectProps
  const size: CountryCodeSelectProps['size'] = props.selectProps.size || 'md'
  return (
    <components.IndicatorsContainer
      className={cn(styles.indicatorsContainer, {
        [styles.dontRotateIconOnOpen]: icon !== 'chevronDown',
        [styles.indicatorsContainerExtraSmall]: size === 'xs',
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
  return (
    <components.SingleValue
      className={cn(styles.singleValue, styles.singleValueSizes[size])}
      {...props}
    />
  )
}

export const ValueContainer = (
  props: ValueContainerProps<ReactSelectOption>,
) => <components.ValueContainer className={styles.valueContainer} {...props} />

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
    />
  )
}
export const Control = (props: ControlProps<ReactSelectOption>) => {
  return (
    <components.Control
      className={cn(styles.container, {
        [styles.hasError]: props.selectProps.hasError,
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
