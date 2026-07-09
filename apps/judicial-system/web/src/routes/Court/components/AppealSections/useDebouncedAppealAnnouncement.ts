import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import { AppealDecisionPartyRole } from '@island.is/judicial-system-web/src/graphql/schema'
import useCaseAppealDecision from '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision'
import {
  caseLevelAppealAnnouncement,
  withCaseLevelAppealDecision,
} from '@island.is/judicial-system-web/src/utils/utils'

// Debounced free-text appeal-announcement input that persists through the
// case-level appeal-decision mutation, reading and optimistically updating the
// case-level appeal_decision row for the given party role.
const useDebouncedAppealAnnouncement = (
  partyRole: AppealDecisionPartyRole,
  delay = 500,
) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCaseAppealDecision } = useCaseAppealDecision()

  const initialValue = caseLevelAppealAnnouncement(workingCase, partyRole) ?? ''
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
      setWorkingCase((prev) => ({
        ...prev,
        appealDecisions: withCaseLevelAppealDecision(
          prev.appealDecisions,
          partyRole,
          { announcement: newValue },
        ),
      }))
    },
    [partyRole, setWorkingCase],
  )

  return { value, onChange }
}

export default useDebouncedAppealAnnouncement
