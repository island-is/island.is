import { uuid } from 'uuidv4'

import {
  CaseState,
  completedCaseStates,
  defenceRoles,
  indictmentCases,
  investigationCases,
  RequestSharedWithDefender,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../..'
import { verifyFullAccess, verifyNoAccess } from './verify'

describe.each(defenceRoles)('defence user %s', (role) => {
  const user = { role, nationalId: uuid() } as User

  describe.each([...restrictionCases, ...investigationCases])(
    `r-case type %s`,
    (type) => {
      const accessibleCaseStates = [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedCaseStates,
      ]

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        const theCase = {
          type,
          state,
          defenderNationalId: user.nationalId,
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('accessible case state SUBMITTED', () => {
        const accessibleRequestSharing = [
          RequestSharedWithDefender.READY_FOR_COURT,
        ]

        describe.each([
          undefined,
          ...Object.values(RequestSharedWithDefender).filter(
            (share) => !accessibleRequestSharing.includes(share),
          ),
        ])('request not shared with defender (%s) on submission', (share) => {
          const theCase = {
            type,
            state: CaseState.SUBMITTED,
            requestSharedWithDefender: share,
            defenderNationalId: user.nationalId,
          } as Case

          verifyNoAccess(theCase, user)
        })

        describe.each(accessibleRequestSharing)(
          'request shared with defender (%s) on submission',
          (share) => {
            describe('defender not assigned to case', () => {
              const theCase = {
                type,
                state: CaseState.SUBMITTED,
                requestSharedWithDefender: share,
              } as Case

              verifyNoAccess(theCase, user)
            })

            describe('defender assigned to case', () => {
              const theCase = {
                type,
                state: CaseState.SUBMITTED,
                defenderNationalId: user.nationalId,
                requestSharedWithDefender: share,
              } as Case

              verifyFullAccess(theCase, user)
            })
          },
        )
      })

      describe('accessible case state RECEIVED', () => {
        describe('court date not set and request not shared with defender on submission', () => {
          const theCase = {
            type,
            state: CaseState.RECEIVED,
            defenderNationalId: user.nationalId,
          } as Case

          verifyNoAccess(theCase, user)
        })

        describe('court date not set, request shared with defender on submission, but defender not assigned to case', () => {
          const theCase = {
            type,
            state: CaseState.RECEIVED,
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
            courtDate: new Date(),
          } as Case

          verifyNoAccess(theCase, user)
        })

        describe('court date not set, but request shared with defender on submission and defender assigned to case', () => {
          const theCase = {
            type,
            state: CaseState.RECEIVED,
            requestSharedWithDefender:
              RequestSharedWithDefender.READY_FOR_COURT,
            defenderNationalId: user.nationalId,
          } as Case

          verifyFullAccess(theCase, user)
        })

        describe('court date set and defender assigned to case', () => {
          const theCase = {
            type,
            state: CaseState.RECEIVED,
            defenderNationalId: user.nationalId,
            courtDate: new Date(),
          } as Case

          verifyFullAccess(theCase, user)
        })
      })

      describe.each(
        accessibleCaseStates.filter(
          (state) =>
            state !== CaseState.SUBMITTED && state !== CaseState.RECEIVED,
        ),
      )('accessible case state %s', (state) => {
        describe('defender not assigned to case', () => {
          const theCase = {
            type,
            state,
          } as Case

          verifyNoAccess(theCase, user)
        })

        describe('defender assigned to case', () => {
          const theCase = {
            type,
            state,
            defenderNationalId: user.nationalId,
          } as Case

          verifyFullAccess(theCase, user)
        })
      })
    },
  )

  describe.each(indictmentCases)(`s-case type %s`, (type) => {
    const accessibleCaseStates = [CaseState.RECEIVED, ...completedCaseStates]

    describe.each(
      Object.values(CaseState).filter(
        (state) => !accessibleCaseStates.includes(state),
      ),
    )('inaccessible case state %s', (state) => {
      const theCase = { type, state } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
      describe('defender not assigned to case', () => {
        const theCase = {
          type,
          state,
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('defender assigned to case', () => {
        const theCase = {
          type,
          state,
          defendants: [{}, { defenderNationalId: user.nationalId }, {}],
        } as Case

        verifyFullAccess(theCase, user)
      })
    })
  })
})
