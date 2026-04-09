import { Op } from 'sequelize'

import { type User } from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import { publicProsecutionIndictmentsAccessWhereOptions } from './access'
import { buildHasDefendantWithNullReviewDecisionCondition } from './conditions'

// Public prosecution indictments
// Specific for prosecutors at the public prosecutor office

export const publicProsecutionIndictmentsInReviewWhereOptions = (
  user: User,
): CaseWhereOptions => ({
  where: {
    [Op.and]: [
      publicProsecutionIndictmentsAccessWhereOptions(user),
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
      buildHasDefendantWithNullReviewDecisionCondition(false),
    ],
  },
})
