import {
  CaseAppealState,
  CaseState,
  CaseType,
  completedRequestCaseStates,
  courtOfAppealsRoles,
  InstitutionType,
  investigationCases,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../../factories'
import { Case } from '../../../repository'
import { verifyFullAccess, verifyNoAccess } from './verify'

describe.each(courtOfAppealsRoles)('appeals court user %s', (role) => {
  const user = {
    role,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const accessibleCaseTypes = [...restrictionCases, ...investigationCases]

  describe.each(
    Object.values(CaseType).filter(
      (type) => !accessibleCaseTypes.includes(type),
    ),
  )('inaccessible case type %s', (type) => {
    const theCase = { type } as Case

    verifyNoAccess(theCase, user)
  })

  describe.each(accessibleCaseTypes)('accessible case type %s', (type) => {
    const accessibleCaseStates = completedRequestCaseStates

    describe.each(
      Object.values(CaseState).filter(
        (state) => !accessibleCaseStates.includes(state),
      ),
    )('inaccessible case state %s', (state) => {
      const theCase = { type, state } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
      const accessibleCaseAppealStates = [
        CaseAppealState.RECEIVED,
        CaseAppealState.COMPLETED,
        CaseAppealState.WITHDRAWN,
      ]

      describe.each(
        [undefined, ...Object.values(CaseAppealState)].filter(
          (state) => !state || !accessibleCaseAppealStates.includes(state),
        ),
      )('inaccessible case appeal state %s', (appealState) => {
        const theCase = { type, state, appealState } as Case

        verifyNoAccess(theCase, user)
      })

      describe.each(accessibleCaseAppealStates)(
        'accessible case appeal state %s',
        (appealState) => {
          const theCase = {
            type,
            state,
            appealState,
            appealReceivedByCourtDate: nowFactory(),
          } as Case

          verifyFullAccess(theCase, user)
        },
      )
    })
  })
})
