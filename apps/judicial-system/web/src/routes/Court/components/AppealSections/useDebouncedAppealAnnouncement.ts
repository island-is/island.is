import { useContext } from 'react'

import { FormContext } from '@island.is/judicial-system-web/src/components'
import { AppealDecisionPartyRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { useDebouncedField } from '@island.is/judicial-system-web/src/utils/hooks'
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

  // An emptied field is persisted like any other value. The announcement is
  // nullable and clearing it is a real edit - the sibling paths already write
  // it (the ruling-order card on blur, and picking a non-APPEAL decision,
  // which clears the autofilled text). Skipping it would leave the row holding
  // text the judge deleted, restored on the next reload. useDebouncedField
  // persists an empty value unless the field declares validations.
  const { value, onChange } = useDebouncedField({
    value: caseLevelAppealAnnouncement(workingCase.appealDecisions, partyRole),
    delay,
    onChange: (announcement) =>
      setWorkingCase((prev) => ({
        ...prev,
        appealDecisions: withCaseLevelAppealDecision(
          prev.appealDecisions,
          partyRole,
          { announcement },
        ),
      })),
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
