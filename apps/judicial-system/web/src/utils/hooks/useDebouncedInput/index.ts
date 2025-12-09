import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { FormContext } from '@island.is/judicial-system-web/src/components'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../formHelper'
import { Validation } from '../../validate'
import { UpdateCase, useCase } from '..'

const useDebouncedInput = <T extends keyof UpdateCase>(
  fieldName: T,
  initialValue: UpdateCase[T],
  validations: Validation[] = [],
  delay = 500,
) => {
  const [value, setValue] = useState(initialValue)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const { updateCase } = useCase()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  useEffect(() => {
    if (!hasUserEdited && initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue, hasUserEdited, value])

  useDebounce(
    () => {
      if (hasUserEdited) {
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

  return {
    value,
    errorMessage,
    hasError: errorMessage !== '',
    onChange: handleChange,
  }
}

export default useDebouncedInput
