import { Box, Icon } from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { ChangeEvent, useState } from 'react'
import * as styles from './Checkbox.css'
import cn from 'classnames'

interface Props {
  name?: string
  id?: string
  checked?: boolean
  disabled?: boolean
  onChange?(event: ChangeEvent<HTMLInputElement>): void
  value?: string
  defaultChecked?: boolean
  hasError?: boolean
  errorMessage?: string
}

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

const Checkbox = ({
  name,
  id = name,
  checked: checkedFromProps,
  disabled,
  onChange,
  value,
  defaultChecked,
  hasError,
  errorMessage,
  dataTestId,
}: Props & TestSupport) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

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

  return (
    <Box className={styles.container}>
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        data-testId={dataTestId}
        onChange={onChangeHandler}
        value={value}
        checked={checked}
        {...(ariaError as AriaError)}
      />
      <label
        className={cn(styles.label, {
          [styles.checkboxLabelDisabled]: disabled,
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

export default Checkbox
