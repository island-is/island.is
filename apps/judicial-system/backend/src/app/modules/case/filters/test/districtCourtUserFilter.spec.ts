import { v4 as uuid } from 'uuid'

import {
  CaseState,
  districtCourtRoles,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { verifyFullAccess, verifyNoAccess } from './verify'

const continueFromCaseState = (user: User, type: string, state: string) => {
  describe('user is not from assigned institution', () => {
    const theCase = {
      type,
      state,
      courtId: uuid(),
    } as Case

    verifyNoAccess(theCase, user)
  })

  describe('user is from assigned institution', () => {
    const theCase = {
      type,
      state,
      courtId: user.institution?.id,
    } as Case

    verifyFullAccess(theCase, user)
  })
}

const continueFromIndictmentType = (user: User, type: string) => {
  const accessibleCaseStates = [
    CaseState.SUBMITTED,
    CaseState.WAITING_FOR_CANCELLATION,
    CaseState.RECEIVED,
    CaseState.COMPLETED,
  ]

  describe.each(
    Object.values(CaseState).filter(
      (state) => !accessibleCaseStates.includes(state),
    ),
  )('inaccessible case state %s', (state) => {
    const theCase = {
      type,
      state,
    } as Case

    verifyNoAccess(theCase, user)
  })

  describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
    continueFromCaseState(user, type, state)
  })
}

describe.each(districtCourtRoles)('district court user %s', (role) => {
  const user = {
    role,
    institution: { id: uuid(), type: InstitutionType.DISTRICT_COURT },
  } as User

  describe.each([...restrictionCases, ...investigationCases])(
    'accessible case type %s',
    (type) => {
      const accessibleCaseStates = [
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ]

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        const theCase = {
          type,
          state,
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe.each(accessibleCaseStates)(
        'accessible case state %s',
        (state) => {
          continueFromCaseState(user, type, state)
        },
      )
    },
  )

  describe.each(indictmentCases)('accessible case type %s', (type) => {
    continueFromIndictmentType(user, type)
  })
})
