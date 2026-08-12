import { useContext } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import { AppealDecisionPartyRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDebouncedField } from '@island.is/judicial-system-web/src/utils/hooks'
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

  const { value, onChange } = useDebouncedField({
    value: workingCase[fieldName],
    delay,
    onChange: (announcement) =>
      setWorkingCase((prev) => ({ ...prev, [fieldName]: announcement })),
    onSave: (announcement) =>
      updateCaseAppealDecision({
        caseId: workingCase.id,
        partyRole,
        announcement,
      }),
  })

  return { value, onChange }
}

export default useDebouncedAppealAnnouncement
