import { useContext } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../formHelper'
import { Validation } from '../../validate'
import useDebouncedField from '../useDebouncedField'
import { UpdateCase, useCase } from '..'

// Debounced text input for a case level field. Thin wrapper around
// useDebouncedField that supplies the case specific pieces: the working case as
// the source of truth, an optimistic write through setWorkingCase and a
// persist through updateCase.
const useDebouncedInput = <T extends keyof UpdateCase>(
  fieldName: T,
  validations: Validation[] = [],
  delay = 500,
) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  return useDebouncedField({
    value: workingCase[fieldName as keyof typeof workingCase] as string,
    validations,
    delay,
    onChange: (value) =>
      removeTabsValidateAndSet(fieldName, value, validations, setWorkingCase),
    // validateAndSendToServer skips cases without an id, so a field edited
    // before the case exists is not persisted here.
    onSave: (value) =>
      validateAndSendToServer(
        fieldName,
        value,
        validations,
        workingCase,
        updateCase,
      ),
  })
}

export default useDebouncedInput
