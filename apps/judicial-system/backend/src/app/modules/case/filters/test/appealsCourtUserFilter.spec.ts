import {
  AppealCaseState,
  courtOfAppealsRoles,
  indictmentCases,
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

  const accessibleCaseTypes = [
    ...restrictionCases,
    ...investigationCases,
    ...indictmentCases,
  ]

  const accessibleAppealCaseStates = [
    AppealCaseState.RECEIVED,
    AppealCaseState.COMPLETED,
    AppealCaseState.WITHDRAWN,
  ]

  const inaccessibleAppealCaseStates = [
    undefined,
    ...Object.values(AppealCaseState),
  ].filter((s) => !s || !accessibleAppealCaseStates.includes(s))

  describe.each(accessibleCaseTypes)('accessible case type %s', (type) => {
    describe('no appeal case', () => {
      const theCase = { type } as Case

      verifyNoAccess(theCase, user)
    })

    describe.each(inaccessibleAppealCaseStates)(
      'inaccessible case appeal state %s',
      (appealState) => {
        const theCase = {
          type,
          appealCase: { appealState },
        } as Case

        verifyNoAccess(theCase, user)
      },
    )

    describe.each(accessibleAppealCaseStates)(
      'accessible case appeal state %s',
      (appealState) => {
        const theCase = {
          type,
          appealCase: {
            appealState,
            appealReceivedByCourtDate: nowFactory(),
          },
        } as Case

        verifyFullAccess(theCase, user)
      },
    )

    describe('withdrawn appeal case without appeal-received-by-court date', () => {
      const theCase = {
        type,
        appealCase: { appealState: AppealCaseState.WITHDRAWN },
      } as Case

      verifyNoAccess(theCase, user)
    })
  })

  // Ruling-order appeals are indictment-only (request cases never carry them).
  describe.each(indictmentCases)(
    'indictment case type %s — ruling-order appeals',
    (type) => {
      describe.each(inaccessibleAppealCaseStates)(
        'single ruling-order appeal in inaccessible state %s',
        (appealState) => {
          const theCase = {
            type,
            rulingOrderAppealCases: [{ appealState }],
          } as Case

          verifyNoAccess(theCase, user)
        },
      )

      describe.each(accessibleAppealCaseStates)(
        'single ruling-order appeal in accessible state %s',
        (appealState) => {
          const theCase = {
            type,
            rulingOrderAppealCases: [
              { appealState, appealReceivedByCourtDate: nowFactory() },
            ],
          } as Case

          verifyFullAccess(theCase, user)
        },
      )

      describe('withdrawn ruling-order appeal without appeal-received-by-court date', () => {
        const theCase = {
          type,
          rulingOrderAppealCases: [{ appealState: AppealCaseState.WITHDRAWN }],
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe('multiple ruling-order appeals — at least one accessible', () => {
        const theCase = {
          type,
          rulingOrderAppealCases: [
            { appealState: AppealCaseState.APPEALED },
            {
              appealState: AppealCaseState.RECEIVED,
              appealReceivedByCourtDate: nowFactory(),
            },
          ],
        } as Case

        verifyFullAccess(theCase, user)
      })

      describe('multiple ruling-order appeals — none accessible', () => {
        const theCase = {
          type,
          rulingOrderAppealCases: [
            { appealState: AppealCaseState.APPEALED },
            { appealState: AppealCaseState.WITHDRAWN },
          ],
        } as Case

        verifyNoAccess(theCase, user)
      })
    },
  )
})
