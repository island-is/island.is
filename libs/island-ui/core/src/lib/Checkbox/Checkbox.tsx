import React, { useState } from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import { Box } from '../Box/Box'
import { InputBackgroundColor } from '../Input/types'
import * as styles from './Checkbox.css'
import { TestSupport } from '@island.is/island-ui/utils'

export interface CheckboxProps {
  name?: string
  id?: string
  label?: React.ReactNode
  ariaLabel?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: React.ReactNode
  hasError?: boolean
  errorMessage?: string
  required?: boolean
  value?: string
  defaultChecked?: boolean
  strong?: boolean
  filled?: boolean
  large?: boolean
  backgroundColor?: InputBackgroundColor
  labelVariant?: 'default' | 'small' | 'medium'
  /** subLabel and rightContent can only be used if the 'large' prop set to true */
  subLabel?: React.ReactNode
  rightContent?: React.ReactNode
}

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export const Checkbox = ({
  label,
  subLabel,
  ariaLabel,
  labelVariant = 'default',
  name,
  id = name,
  disabled,
  required,
  onChange,
  tooltip,
  hasError,
  errorMessage,
  value,
  checked: checkedFromProps,
  defaultChecked,
  large,
  strong,
  backgroundColor,
  dataTestId,
  filled = false,
  rightContent,
}: CheckboxProps & TestSupport) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

  const background =
    backgroundColor && backgroundColor === 'blue' ? 'blue100' : undefined

  // If defaultCheck is specified, we will use it as our initial state.
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked !== undefined ? defaultChecked : false,
  )

  // We need to know whether the component is controlled or not.
  const isCheckedControlled = checkedFromProps !== undefined
  const checked = isCheckedControlled ? checkedFromProps : internalChecked

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCheckedControlled) {
      // If the component is not controlled, we need to update its internal state.
      setInternalChecked(event.target.checked)
    }

    onChange?.(event)
  }
  console.log('required:', required)
  return (
    <Box
      className={cn(styles.container, large, {
        [styles.large]: large,
        [styles.filled]: filled,
      })}
      background={background}
    >
      <input
        className={cn(styles.input, { [styles.inputLarge]: large })}
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        data-testid={dataTestId}
        onChange={onChangeHandler}
        value={value}
        checked={checked}
        aria-label={ariaLabel}
        {...(ariaError as AriaError)}
      />
      <label
        className={cn(styles.label, {
          [styles.checkboxLabelDisabled]: disabled,
          [styles.largeLabel]: large,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            [styles.checkboxError]: hasError,
            [styles.checkboxDisabled]: disabled,
          })}
        >
          <Icon
            icon="checkmark"
            color={checked ? 'white' : 'transparent'}
            ariaHidden
          />
        </div>
        <span className={styles.labelText}>
          <div
            className={cn({
              [styles.labelChildrenFontWeightToggle]: checked || strong,
            })}
          >
            <Text as="span" variant={labelVariant}>
              {label}
              {required && (
                <span aria-hidden="true" className={styles.isRequiredStar}>
                  {' '}
                  *
                </span>
              )}
            </Text>
          </div>
          <div
            aria-hidden="true"
            className={styles.fixJumpingContentFromFontWeightToggle}
          >
            <Text as="span" variant={labelVariant} fontWeight="semiBold">
              {label}
            </Text>
          </div>
          {subLabel && large && (
            <Text
              as="span"
              marginTop="smallGutter"
              fontWeight="regular"
              variant="small"
            >
              {subLabel}
            </Text>
          )}
        </span>

        {rightContent && large && <div>{rightContent}</div>}
        {tooltip && (
          <div
            className={cn(styles.tooltipContainer, {
              [styles.tooltipLargeContainer]: large,
            })}
          >
            <Tooltip text={tooltip} />
          </div>
        )}
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
      </label>
    </Box>
  )
}
