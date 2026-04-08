import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
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

  const accessibleRequestCaseTypes = [
    ...restrictionCases,
    ...investigationCases,
  ]

  describe.each(accessibleRequestCaseTypes)(
    'accessible request case type %s',
    (type) => {
      const accessibleCaseStates = completedRequestCaseStates

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        const theCase = { type, state } as Case

        verifyNoAccess(theCase, user)
      })

      describe.each(accessibleCaseStates)(
        'accessible case state %s',
        (state) => {
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
            const theCase = {
              type,
              state,
              appealCase: { appealState },
            } as Case

            verifyNoAccess(theCase, user)
          })

          describe.each(accessibleCaseAppealStates)(
            'accessible case appeal state %s',
            (appealState) => {
              const theCase = {
                type,
                state,
                appealCase: {
                  appealState,
                  appealReceivedByCourtDate: nowFactory(),
                },
              } as Case

              verifyFullAccess(theCase, user)
            },
          )
        },
      )
    },
  )

  describe.each(indictmentCases)(
    'accessible indictment case type %s',
    (type) => {
      const accessibleCaseStates = completedIndictmentCaseStates

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        const theCase = {
          type,
          state,
          indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
        } as Case

        verifyNoAccess(theCase, user)
      })

      describe.each(accessibleCaseStates)(
        'accessible case state %s',
        (state) => {
          // Non-dismissal ruling decisions should not be accessible
          const inaccessibleRulingDecisions = Object.values(
            CaseIndictmentRulingDecision,
          ).filter((d) => d !== CaseIndictmentRulingDecision.DISMISSAL)

          describe.each([undefined, ...inaccessibleRulingDecisions])(
            'inaccessible ruling decision %s',
            (rulingDecision) => {
              const theCase = {
                type,
                state,
                indictmentRulingDecision: rulingDecision,
                appealCase: {
                  appealState: CaseAppealState.RECEIVED,
                  appealReceivedByCourtDate: nowFactory(),
                },
              } as Case

              verifyNoAccess(theCase, user)
            },
          )

          describe('dismissal ruling decision', () => {
            const accessibleCaseAppealStates = [
              CaseAppealState.RECEIVED,
              CaseAppealState.COMPLETED,
              CaseAppealState.WITHDRAWN,
            ]

            describe.each(
              [undefined, ...Object.values(CaseAppealState)].filter(
                (state) =>
                  !state || !accessibleCaseAppealStates.includes(state),
              ),
            )('inaccessible case appeal state %s', (appealState) => {
              const theCase = {
                type,
                state,
                indictmentRulingDecision:
                  CaseIndictmentRulingDecision.DISMISSAL,
                appealCase: { appealState },
              } as Case

              verifyNoAccess(theCase, user)
            })

            describe.each(accessibleCaseAppealStates)(
              'accessible case appeal state %s',
              (appealState) => {
                const theCase = {
                  type,
                  state,
                  indictmentRulingDecision:
                    CaseIndictmentRulingDecision.DISMISSAL,
                  appealCase: {
                    appealState,
                    appealReceivedByCourtDate: nowFactory(),
                  },
                } as Case

                verifyFullAccess(theCase, user)
              },
            )
          })
        },
      )
    },
  )
})
