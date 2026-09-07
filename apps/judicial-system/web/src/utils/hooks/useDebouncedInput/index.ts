import { useContext } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import type { UpdateCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import useDebouncedField from '@island.is/judicial-system-web/src/utils/hooks/useDebouncedField'
import type { Validation } from '@island.is/judicial-system-web/src/utils/validate'

type SharedField = keyof UpdateCase & keyof Case

/**
 * Case fields this hook can drive: present on both `UpdateCase` and `Case`, and
 * string valued. `UpdateCase` also holds non-string fields and id fields such
 * as `courtId` that are not columns on `workingCase`, and reading those through
 * here would need a cast that hides the mismatch.
 */
type StringCaseField = {
  [K in SharedField]-?: NonNullable<UpdateCase[K]> extends string ? K : never
}[SharedField]

// Debounced text input for a case level field. Thin wrapper around
// useDebouncedField that supplies the case specific pieces: the working case as
// the source of truth, an optimistic write through setWorkingCase and a
// persist through updateCase.
const useDebouncedInput = <T extends StringCaseField>(
  fieldName: T,
  validations: Validation[] = [],
  delay = 500,
) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  return useDebouncedField({
    value: workingCase[fieldName],
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
