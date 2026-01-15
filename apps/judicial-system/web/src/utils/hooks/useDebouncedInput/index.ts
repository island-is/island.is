import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { FormContext } from '@island.is/judicial-system-web/src/components'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
  validateAndSetErrorMessage,
} from '../../formHelper'
import { Validation } from '../../validate'
import { UpdateCase, useCase } from '..'

const useDebouncedInput = <T extends keyof UpdateCase>(
  fieldName: T,
  validations: Validation[] = [],
  delay = 500,
) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const initialValue = workingCase[
    fieldName as keyof typeof workingCase
  ] as string
  const [value, setValue] = useState(initialValue)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const { updateCase } = useCase()

  useEffect(() => {
    if (!hasUserEdited && initialValue !== value) {
      setValue(initialValue ?? '')
    }
  }, [initialValue, hasUserEdited, value])

  useDebounce(
    () => {
      if (hasUserEdited) {
        if (value === '') {
          return
        }

        validateAndSendToServer(
          fieldName,
          value,
          validations,
          workingCase,
          updateCase,
          setErrorMessage,
        )
      }
    },
    delay,
    [value],
  )

  const handleChange = useCallback(
    (newValue: UpdateCase[T]) => {
      setValue(newValue)
      setHasUserEdited(true)
      removeTabsValidateAndSet(
        fieldName,
        newValue,
        validations,
        setWorkingCase,
        errorMessage,
        setErrorMessage,
      )
    },
    [fieldName, validations, setWorkingCase, errorMessage],
  )

  const handleBlur = useCallback(
    (value: UpdateCase[T]) =>
      validateAndSetErrorMessage(validations, value, setErrorMessage),
    [validations],
  )

  return {
    value,
    errorMessage,
    hasError: errorMessage !== '',
    onChange: handleChange,
    onBlur: handleBlur,
  }
}

export default useDebouncedInput
