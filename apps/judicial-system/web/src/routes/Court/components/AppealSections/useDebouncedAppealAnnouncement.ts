import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import { AppealDecisionPartyRole } from '@island.is/judicial-system-web/src/graphql/schema'
import useCaseAppealDecision from '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision'

// Debounced free-text appeal-announcement input that persists through the
// case-level appeal-decision mutation (the new write source) rather than the
// legacy case column, while keeping an optimistic local update for the UI.
const useDebouncedAppealAnnouncement = (
  partyRole: AppealDecisionPartyRole,
  fieldName: 'accusedAppealAnnouncement' | 'prosecutorAppealAnnouncement',
  delay = 500,
) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCaseAppealDecision } = useCaseAppealDecision()

  const initialValue = (workingCase[fieldName] as string | undefined) ?? ''
  const [value, setValue] = useState(initialValue)
  const [hasUserEdited, setHasUserEdited] = useState(false)

  // Follow server / autofill updates until the user starts editing.
  useEffect(() => {
    if (!hasUserEdited && initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue, hasUserEdited, value])

  useDebounce(
    () => {
      if (hasUserEdited && value !== '') {
        updateCaseAppealDecision({
          caseId: workingCase.id,
          partyRole,
          announcement: value,
        })
      }
    },
    delay,
    [value],
  )

  const onChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      setHasUserEdited(true)
      setWorkingCase((prev) => ({ ...prev, [fieldName]: newValue }))
    },
    [fieldName, setWorkingCase],
  )

  return { value, onChange }
}

export default useDebouncedAppealAnnouncement
