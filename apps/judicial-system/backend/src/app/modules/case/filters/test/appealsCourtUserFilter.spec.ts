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
import { AppealSummons, Case } from '../../../repository'
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

  // A verdict appeal is the court's once an appeal summons has been sent to
  // it, whatever state the appeal is in - unlike a ruling appeal, which it
  // only sees once received. The court has to be able to open one in order to
  // receive it at all, but not while the public prosecution is still
  // preparing it.
  //
  // This mirrors the case table access rule, which asks for a sent summons
  // too. The two have to agree: a court that is shown a row it cannot open is
  // worse off than one not shown it.
  describe.each(indictmentCases)('verdict appeal on indictment %s', (type) => {
    const sentAppealSummonses = [
      { id: 'summons_id', sentToCourtOfAppealsDate: new Date() },
    ]

    describe.each(Object.values(AppealCaseState))(
      'verdict appeal state %s',
      (appealState) => {
        describe('with a summons sent to the court', () => {
          const theCase = {
            type,
            verdictAppealCase: { appealState, sentAppealSummonses },
          } as Case

          verifyFullAccess(theCase, user)
        })

        describe('with no summons sent to the court', () => {
          const theCase = {
            type,
            verdictAppealCase: {
              appealState,
              sentAppealSummonses: [] as AppealSummons[],
            },
          } as Case

          verifyNoAccess(theCase, user)
        })

        // Drafts and confirmed summonses sit on the unscoped association,
        // which the court's rule does not read.
        describe('with only unsent summonses', () => {
          const theCase = {
            type,
            verdictAppealCase: {
              appealState,
              appealSummonses: [{ id: 'draft_id' }],
            },
          } as Case

          verifyNoAccess(theCase, user)
        })
      },
    )

    describe('verdict appeal with no state yet', () => {
      describe('with a summons sent to the court', () => {
        const theCase = {
          type,
          verdictAppealCase: { sentAppealSummonses },
        } as Case

        verifyFullAccess(theCase, user)
      })

      describe('with no summons loaded', () => {
        const theCase = { type, verdictAppealCase: {} } as Case

        verifyNoAccess(theCase, user)
      })
    })
  })

  // Request cases are appealed by kaera only, so a verdict appeal on one is
  // not a route in.
  describe.each([...restrictionCases, ...investigationCases])(
    'verdict appeal on request case %s',
    (type) => {
      const theCase = {
        type,
        verdictAppealCase: { appealState: AppealCaseState.RECEIVED },
      } as Case

      verifyNoAccess(theCase, user)
    },
  )
})
