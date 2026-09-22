import { Op } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  type User,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import { publicProsecutionIndictmentsAccessWhereOptions } from './access'
import {
  buildHasAppealedVerdictCondition,
  buildHasDefendantWithNullReviewDecisionCondition,
} from './conditions'

// Public prosecution indictments
// Specific for prosecutors at the public prosecutor office

// These two lists are this user's own review work, so they narrow the access
// options back to the cases assigned to them. The access options are wider than
// that on purpose - they also carry every appealed verdict, whoever reviewed it
// - and without this restriction an appealed case the user never touched would
// surface as one of their cases to review.
const isReviewedByUser = (user: User) => ({ indictment_reviewer_id: user.id })

export const publicProsecutionIndictmentsInReviewWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    [Op.and]: [
      publicProsecutionIndictmentsAccessWhereOptions(user),
      isReviewedByUser(user),
      buildHasDefendantWithNullReviewDecisionCondition(true),
    ],
  },
})

export const publicProsecutionIndictmentsReviewedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    [Op.and]: [
      publicProsecutionIndictmentsAccessWhereOptions(user),
      isReviewedByUser(user),
      buildHasDefendantWithNullReviewDecisionCondition(false),
    ],
  },
})

// Which of the cases this user can reach are the appealed ones. The access
// options already let an appealed verdict through whoever reviewed it, so this
// only has to pick them out again - a case they reviewed themselves belongs
// here too once it is appealed.
//
// One row per case, so no displayCases - unlike the office's list of the same
// name, which gives each defendant a row of their own.
export const publicProsecutionIndictmentsAppealedWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    [Op.and]: [
      publicProsecutionIndictmentsAccessWhereOptions(user),
      { indictment_ruling_decision: CaseIndictmentRulingDecision.RULING },
      buildHasAppealedVerdictCondition(),
    ],
  },
})
