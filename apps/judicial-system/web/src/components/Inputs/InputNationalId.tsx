import { ChangeEvent, FC, FocusEvent, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'

import { validate } from '../../utils/validate'
import { InputProps } from './types'

interface Props extends InputProps {
  isDateOfBirth: boolean
}

const InputNationalId: FC<Props> = (props) => {
  const {
    isDateOfBirth,
    value,
    onChange,
    onBlur,
    disabled = false,
    label,
    placeholder,
  } = props
  const { formatMessage } = useIntl()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [inputValue, setInputValue] = useState<string>(value || '')

  const handleBlur = (evt: FocusEvent<HTMLInputElement, Element>) => {
    const inputValidator = validate([
      [
        evt.target.value,
        isDateOfBirth ? ['date-of-birth'] : ['empty', 'national-id'],
      ],
    ])

    if (inputValidator.isValid) {
      setErrorMessage(undefined)
      onBlur(inputValue)
    } else {
      setErrorMessage(inputValidator.errorMessage)
    }
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value)
    onChange(inputValue)
  }

  return (
    <InputMask
      // eslint-disable-next-line local-rules/disallow-kennitalas
      mask={isDateOfBirth ? '99.99.9999' : '999999-9999'}
      maskPlaceholder={null}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
    >
      <Input
        data-testid="inputNationalId"
        name="inputNationalId"
        autoComplete="off"
        label={
          label
            ? label
            : formatMessage(isDateOfBirth ? core.dateOfBirth : core.nationalId)
        }
        placeholder={
          placeholder
            ? placeholder
            : formatMessage(
                isDateOfBirth ? core.dateOfBirthPlaceholder : core.nationalId,
              )
        }
        errorMessage={errorMessage}
        hasError={errorMessage !== undefined}
        required={!isDateOfBirth}
      />
    </InputMask>
  )
}

export default InputNationalId
