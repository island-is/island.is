import { uuid } from 'uuidv4'

import {
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  DateType,
  defenceRoles,
  indictmentCases,
  investigationCases,
  RequestSharedWithDefender,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { verifyFullAccess, verifyNoAccess } from './verify'

// TODO: Fix defender indictment tests
//       Add spokesperson tests

describe.each(defenceRoles)('defence user %s', (role) => {
  const user = { role, nationalId: uuid() } as User

  describe.each([...restrictionCases, ...investigationCases])(
    `defender r-case type %s`,
    (type) => {
      const accessibleCaseStates = [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedRequestCaseStates,
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
            dateLogs: [
              { dateType: DateType.ARRAIGNMENT_DATE, date: new Date() },
            ],
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
            dateLogs: [
              { dateType: DateType.ARRAIGNMENT_DATE, date: new Date() },
            ],
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

  describe.each(indictmentCases)(`defender s-case type %s`, (type) => {
    const accessibleCaseStates = [
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      ...completedIndictmentCaseStates,
    ]

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
          defendants: [
            {},
            {
              defenderNationalId: user.nationalId,
            },
            {},
          ],
          dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, date: new Date() }],
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('confirmed defender assigned to case', () => {
        const theCase = {
          type,
          state,
          defendants: [
            {},
            {
              defenderNationalId: user.nationalId,
              isDefenderChoiceConfirmed: true,
            },
            {},
          ],
          dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, date: new Date() }],
        } as Case

        verifyFullAccess(theCase, user)
      })
    })
  })

  describe.each([...restrictionCases, ...investigationCases])(
    'spokesperson inaccessible r-case type %s',
    (type) => {
      const theCase = {
        type,
      } as Case

      verifyNoAccess(theCase, user)
    },
  )

  describe.each(indictmentCases)(`spokesperson s-case type %s`, (type) => {
    const accessibleCaseStates = [
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.RECEIVED,
      ...completedIndictmentCaseStates,
    ]

    describe.each(
      Object.values(CaseState).filter(
        (state) => !accessibleCaseStates.includes(state),
      ),
    )('inaccessible case state %s', (state) => {
      const theCase = {
        type,
        state,
        civilClaimants: [
          {},
          { hasSpokesperson: true, spokespersonNationalId: user.nationalId },
          {},
        ],
      } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(accessibleCaseStates)('accessible case state %s', (state) => {
      describe('spokesperson not assigned to case', () => {
        const theCase = {
          type,
          state,
          civilClaimants: [
            {},
            { hasSpokesperson: false, spokespersonNationalId: user.nationalId },
            {},
          ],
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('non confirmed spokesperson assigned to case', () => {
        const theCase = {
          type,
          state,
          civilClaimants: [
            {},
            {
              hasSpokesperson: true,
              spokespersonNationalId: user.nationalId,
            },
            {},
          ],
          dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, date: new Date() }],
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('confirmed spokesperson assigned to case', () => {
        const theCase = {
          type,
          state,
          civilClaimants: [
            {},
            {
              hasSpokesperson: true,
              spokespersonNationalId: user.nationalId,
              isSpokespersonConfirmed: true,
            },
            {},
          ],
          dateLogs: [{ dateType: DateType.ARRAIGNMENT_DATE, date: new Date() }],
        } as Case

        verifyFullAccess(theCase, user)
      })
    })
  })
})
