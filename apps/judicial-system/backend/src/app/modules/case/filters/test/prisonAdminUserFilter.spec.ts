import {
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  InstitutionType,
  prisonSystemRoles,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../../repository'
import { verifyFullAccess, verifyNoAccess, verifyReadAccess } from './verify'

describe.each(prisonSystemRoles)('prison admin user %s', (role) => {
  const user = {
    role,
    institution: { type: InstitutionType.PRISON_ADMIN },
  } as User

  const accessibleRequestCaseTypes = [
    ...restrictionCases,
    CaseType.PAROLE_REVOCATION,
  ]
  const accessibleIndictmentCaseTypes = indictmentCases

  describe.each(
    Object.values(CaseType).filter(
      (type) =>
        !accessibleRequestCaseTypes.includes(type) &&
        !accessibleIndictmentCaseTypes.includes(type),
    ),
  )('inaccessible case type %s', (type) => {
    describe.each(Object.values(CaseState))('case state %s', (state) => {
      describe.each(Object.values(CaseDecision))(
        'case decision %s',
        (decision) => {
          const theCase = { type, state, decision } as Case

          verifyNoAccess(theCase, user)
        },
      )
    })
  })

  describe.each(accessibleRequestCaseTypes)(
    'accessible request case type %s',
    (type) => {
      const accessibleCaseStates = [CaseState.ACCEPTED]

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        describe.each(Object.values(CaseDecision))(
          'case decision %s',
          (decision) => {
            const theCase = { type, state, decision } as Case

            verifyNoAccess(theCase, user)
          },
        )
      })

      describe.each(accessibleCaseStates)(
        'accessible case state %s',
        (state) => {
          const accessibleCaseDecisions = [
            CaseDecision.ACCEPTING,
            CaseDecision.ACCEPTING_PARTIALLY,
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
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
              if (type === CaseType.CUSTODY) {
                verifyFullAccess(theCase, user)
              } else {
                verifyReadAccess(theCase, user)
              }
            },
          )
        },
      )
    },
  )

  describe.each(accessibleIndictmentCaseTypes)(
    'accessible request case type %s',
    (type) => {
      const accessibleCaseStates = [CaseState.COMPLETED]

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        describe.each(Object.values(CaseIndictmentRulingDecision))(
          'case indictment ruling decision %s',
          (indictmentRulingDecision) => {
            describe.each(Object.values(IndictmentCaseReviewDecision))(
              'indictment case review decision %s',
              (indictmentReviewDecision) => {
                const theCase = {
                  type,
                  state,
                  indictmentRulingDecision,
                  defendants: [{ indictmentReviewDecision }],
                } as Case

                verifyNoAccess(theCase, user)
              },
            )
          },
        )
      })

      describe.each(accessibleCaseStates)(
        'accessible case state %s',
        (state) => {
          const accessibleCaseIndictmentRulingDecisions = [
            CaseIndictmentRulingDecision.RULING,
            CaseIndictmentRulingDecision.FINE,
          ]

          describe.each(
            Object.values(CaseIndictmentRulingDecision).filter(
              (indictmentRulingDecision) =>
                !accessibleCaseIndictmentRulingDecisions.includes(
                  indictmentRulingDecision,
                ),
            ),
          )(
            'inaccessible case indictment ruling decision %s',
            (indictmentRulingDecision) => {
              describe.each(Object.values(IndictmentCaseReviewDecision))(
                'indictment case review decision %s',
                (indictmentReviewDecision) => {
                  const theCase = {
                    type,
                    state,
                    indictmentRulingDecision,
                    defendants: [{ indictmentReviewDecision }],
                  } as Case

                  verifyNoAccess(theCase, user)
                },
              )
            },
          )

          describe.each(accessibleCaseIndictmentRulingDecisions)(
            'accessible case indictment ruling decision %s',
            (indictmentRulingDecision) => {
              const accessibleIndictmentCaseReviewDecisions = [
                IndictmentCaseReviewDecision.ACCEPT,
              ]

              describe.each(
                Object.values(IndictmentCaseReviewDecision).filter(
                  (indictmentReviewDecision) =>
                    !accessibleIndictmentCaseReviewDecisions.includes(
                      indictmentReviewDecision,
                    ),
                ),
              )(
                'inaccessible indictment case review decision %s',
                (indictmentReviewDecision) => {
                  const theCase = {
                    type,
                    state,
                    indictmentRulingDecision,
                    defendants: [{ indictmentReviewDecision }],
                  } as Case

                  verifyNoAccess(theCase, user)
                },
              )

              describe.each(accessibleIndictmentCaseReviewDecisions)(
                'accessible indictment case review decision %s',
                (indictmentReviewDecision) => {
                  describe('no defendant has been sent to the prison admin', () => {
                    const theCase = {
                      type,
                      state,
                      indictmentRulingDecision,
                      defendants: [{ indictmentReviewDecision }],
                    } as Case

                    verifyNoAccess(theCase, user)
                  })

                  describe('a defendant has been sent to the prison admin', () => {
                    const theCase = {
                      type,
                      state,
                      indictmentRulingDecision,
                      defendants: [
                        { indictmentReviewDecision, isSentToPrisonAdmin: true },
                      ],
                    } as Case

                    if (type === CaseType.INDICTMENT) {
                      verifyFullAccess(theCase, user)
                    } else {
                      verifyReadAccess(theCase, user)
                    }
                  })
                },
              )
            },
          )
        },
      )
    },
  )
})
