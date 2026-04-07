import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { InputMask } from '@react-input/mask'

import { Input } from '@island.is/island-ui/core'
import { EDITABLE_DATE } from '@island.is/judicial-system/consts'

import { validate } from '../../utils/validate'
import { InputProps } from './types'

const InputDate: FC<InputProps> = ({
  value,
  onBlur,
  onChange,
  label,
  placeholder,
  required,
  disabled,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>()
  const [inputValue, setInputValue] = useState<string>(value ?? '')

  const handleBlur = (
    evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const inputValidator = validate([[evt.target.value, ['date-of-birth']]])

    if (inputValidator.isValid || (!required && !evt.target.value)) {
      setErrorMessage(undefined)
      onBlur(evt.target.value)
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
  }, [value])

  return (
    <InputMask
      name="input_date"
      mask={EDITABLE_DATE}
      replacement={{ _: /\d/ }}
      component={Input}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      errorMessage={errorMessage}
      hasError={Boolean(errorMessage)}
      label={label ?? 'Dagsetning'}
      placeholder={placeholder ?? 'dd.mm.áááá'}
      required={required}
      autoComplete="off"
    />
  )
}

export default InputDate
