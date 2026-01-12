import {
  CaseDecision,
  CaseState,
  CaseType,
  InstitutionType,
  prisonSystemRoles,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { verifyNoAccess, verifyReadAccess } from './verify'

describe.each(prisonSystemRoles)('prison staff user %s', (role) => {
  const user = { role, institution: { type: InstitutionType.PRISON } } as User

  const accessibleCaseTypes = [
    CaseType.CUSTODY,
    CaseType.ADMISSION_TO_FACILITY,
    CaseType.PAROLE_REVOCATION,
  ]
  describe.each(
    Object.values(CaseType).filter(
      (type) => !accessibleCaseTypes.includes(type),
    ),
  )('inaccessible case type %s', (type) => {
    const theCase = { type } as Case

    verifyNoAccess(theCase, user)
  })

  describe.each(accessibleCaseTypes)('accessible case type %s', (type) => {
    const accessibleCaseStates = [CaseState.ACCEPTED]

    describe.each(
      Object.values(CaseState).filter(
        (state) => !accessibleCaseStates.includes(state),
      ),
    )('inaccessible case state %s', (state) => {
      const theCase = { type, state } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
      const accessibleCaseDecisions = [
        CaseDecision.ACCEPTING,
        CaseDecision.ACCEPTING_PARTIALLY,
      ]

      describe.each(
        Object.values(CaseDecision).filter(
          (decision) => !accessibleCaseDecisions.includes(decision),
        ),
      )('inaccessible case decision %s', (decision) => {
        const theCase = { type, state, decision } as Case

        verifyNoAccess(theCase, user)
      })

      describe.each(accessibleCaseDecisions)(
        'accessible case decision %s',
        (decision) => {
          const theCase = { type, state, decision } as Case

          verifyReadAccess(theCase, user)
        },
      )
    })
  })
})
