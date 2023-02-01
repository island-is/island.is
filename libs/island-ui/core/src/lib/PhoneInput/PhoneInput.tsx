import { forwardRef, useRef, useState } from 'react'
import { AriaError, InputBackgroundColor, InputProps } from '../Input/types'
import * as styles from './PhoneInput.css'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Tooltip } from '../Tooltip/Tooltip'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import { resolveResponsiveProp } from '../../utils/responsiveProp'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import { Icon } from '../IconRC/Icon'
import ReactSelect, { ActionMeta, ValueType } from 'react-select'
import { Option as OptionType } from '../Select/Select'
import { CountryCodeSelect } from './CountryCodeSelect/CountryCodeSelect'
import { countryCodes } from './CountryCodeSelect/countryCodes'

const options = countryCodes.map((x) => ({
  label: x.dial_code,
  value: x.dial_code,
  description: x.name,
}))

type PhoneInputProps = Omit<
  InputProps,
  'rows' | 'type' | 'icon' | 'iconType' | 'backgroundColor'
> & {
  backgroundColor?: InputBackgroundColor
  countryCodeValue?: ValueType<OptionType>
  onCountryCodeChange?: ((
    value: ValueType<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => void) &
    ((value: ValueType<OptionType>, action: ActionMeta<OptionType>) => void)
}

export const PhoneInput = forwardRef(
  (props: PhoneInputProps, ref?: React.Ref<HTMLInputElement>) => {
    const {
      name,
      label,
      errorMessage = '',
      maxLength,
      hasError = Boolean(errorMessage),
      value,
      defaultValue,
      id = name,
      disabled,
      required,
      rightAlign,
      placeholder,
      tooltip,
      backgroundColor = 'white',
      onFocus,
      onBlur,
      readOnly,
      onClick,
      onKeyDown,
      textarea,
      size = 'md',
      fixedFocusState,
      autoExpand,
      loading,
      countryCodeValue,
      onCountryCodeChange,
      ...inputProps
    } = props

    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    const errorId = `${id}-error`
    const selectId = `country-code-select-${id}`
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': errorId,
        }
      : {}

    const mapBlue = (color: InputBackgroundColor) =>
      color === 'blue' ? 'blue100' : color
    const containerBackground = Array.isArray(backgroundColor)
      ? backgroundColor.map(mapBlue)
      : mapBlue(backgroundColor as InputBackgroundColor)

    return (
      <Box position="relative">
        {/* If size is xs then the label is above the input box */}
        {size === 'xs' && label && (
          <label
            htmlFor={id}
            className={cn(styles.label, styles.labelSizes[size], {
              [styles.labelDisabledEmptyInput]:
                disabled && !value && !defaultValue,
            })}
          >
            {label}
            {required && (
              <span aria-hidden="true" className={styles.isRequiredStar}>
                {' '}
                *
              </span>
            )}
            {tooltip && (
              <Box marginLeft={1} display="inlineBlock">
                <Tooltip text={tooltip} />
              </Box>
            )}
          </label>
        )}
        <Box
          display="flex"
          alignItems="center"
          background={containerBackground as UseBoxStylesProps['background']}
          className={cn(styles.container, styles.containerSizes[size], {
            [styles.hasError]: hasError,
            [styles.hasFocus]: hasFocus,
            [styles.fixedFocusState]: fixedFocusState,
            [styles.noLabel]: !label,
            [styles.containerDisabled]: disabled,
            [styles.readOnly]: readOnly,
          })}
          /* onClick={(e) => {
            e.preventDefault()
            console.log(e)
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }} */
        >
          <Box flexGrow={1}>
            {size !== 'xs' && label && (
              <label
                htmlFor={id}
                className={cn(styles.label, styles.labelSizes[size], {
                  [styles.labelDisabledEmptyInput]:
                    disabled && !value && !defaultValue,
                })}
              >
                {label}
                {required && (
                  <span aria-hidden="true" className={styles.isRequiredStar}>
                    {' '}
                    *
                  </span>
                )}
                {tooltip && (
                  <Box marginLeft={1} display="inlineBlock">
                    <Tooltip text={tooltip} />
                  </Box>
                )}
              </label>
            )}
            <Box display="flex">
              <CountryCodeSelect
                id={selectId}
                name={selectId}
                onChange={onCountryCodeChange}
                value={countryCodeValue}
                options={options}
                backgroundColor={backgroundColor}
                size={size}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                defaultValue={options.find((x) => x.value === '+354')} // TODO
                dataTestId={`country-code-test-${id}`}
              />
              <input
                className={cn(
                  styles.input,
                  resolveResponsiveProp(
                    backgroundColor,
                    styles.inputBackgroundXs,
                    styles.inputBackgroundSm,
                    styles.inputBackgroundMd,
                    styles.inputBackgroundLg,
                    styles.inputBackgroundXl,
                  ),
                  styles.inputSize[size],
                  {
                    [styles.rightAlign]: rightAlign,
                    [styles.textarea]: textarea,
                  },
                )}
                id={id}
                disabled={disabled}
                name={name}
                ref={mergedRefs}
                placeholder={placeholder}
                value={value}
                maxLength={maxLength}
                defaultValue={defaultValue}
                onFocus={(e) => {
                  setHasFocus(true)
                  if (onFocus) {
                    onFocus(e)
                  }
                }}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e)
                  }
                }}
                onKeyDown={(e) => {
                  if (onKeyDown) {
                    onKeyDown(e)
                  }
                }}
                onBlur={(e) => {
                  setHasFocus(false)
                  if (onBlur) {
                    onBlur(e)
                  }
                }}
                readOnly={readOnly}
                type="tel"
                {...(ariaError as AriaError)}
                {...inputProps}
                {...(required && { 'aria-required': true })}
              />
            </Box>
          </Box>
          {loading && (
            <Box
              className={styles.spinner}
              flexShrink={0}
              borderRadius="circle"
            />
          )}
          {!loading && hasError && (
            <Icon
              icon="warning"
              skipPlaceholderSize
              className={cn(styles.icon, styles.iconError)}
              ariaHidden
            />
          )}
        </Box>
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
            data-testid="inputErrorMessage"
          >
            {errorMessage}
          </div>
        )}
      </Box>
    )
  },
)
