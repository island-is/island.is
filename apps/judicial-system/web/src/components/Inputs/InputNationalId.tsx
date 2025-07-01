import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { InputMask } from '@react-input/mask'

import { Input } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'

import { validate } from '../../utils/validate'
import { InputProps } from './types'

interface Props extends InputProps {
  isDateOfBirth: boolean
}

/**
 * A reusable input component for national ids. A national id can eiter be a SSN
 * or a date of birth. This component handles input validation for national ids,
 * setting and removing the validation's error message.
 */
const InputNationalId: FC<Props> = (props) => {
  const {
    // Controls wheter the national id is a SSN or a date of birth.
    isDateOfBirth,

    // The initial value.
    value,

    // A function that runs on blur if the input is valid.
    onBlur,

    // A custom label. If not set, a default label is used.
    label,

    // A custom placeholder. If not set, a default placeholder is used.
    placeholder,

    // If true, validation is skipped and a required indicator is set next to label.
    required,

    onChange,
    disabled,
  } = props

  const { formatMessage } = useIntl()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [inputValue, setInputValue] = useState<string>(value || '')

  const handleBlur = (
    evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const inputValidator = validate([
      [
        evt.target.value,
        isDateOfBirth ? ['date-of-birth'] : ['empty', 'national-id'],
      ],
    ])

    if (inputValidator.isValid) {
      setErrorMessage(undefined)
      onBlur(inputValue)
    } else if (!required && !evt.target.value) {
      onBlur(inputValue)
    } else {
      setErrorMessage(inputValidator.errorMessage)
    }
  }

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (evt.target.value) {
      setErrorMessage(undefined)
    }

    setInputValue(evt.target.value)
    onChange && onChange(evt.target.value)
  }

  useEffect(() => {
    setErrorMessage(undefined)
    setInputValue(value ?? '')
  }, [value, isDateOfBirth])

  return (
    <InputMask
      mask={isDateOfBirth ? '__.__.____' : '______-____'}
      replacement={{ _: /\d/ }}
      component={Input}
      value={inputValue ?? value}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      errorMessage={errorMessage}
      hasError={Boolean(errorMessage)}
      placeholder={
        placeholder ??
        formatMessage(
          isDateOfBirth ? core.dateOfBirthPlaceholder : core.nationalId,
        )
      }
      required={required}
      name="nationalId"
      id="nationalId"
      data-testid="inputNationalId"
      autoComplete="off"
      label={
        label ??
        formatMessage(isDateOfBirth ? core.dateOfBirth : core.nationalId)
      }
    />
  )
}

export default InputNationalId
