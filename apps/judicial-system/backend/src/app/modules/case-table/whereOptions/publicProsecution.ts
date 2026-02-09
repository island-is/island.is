import { Op } from 'sequelize'

import { type User } from '@island.is/judicial-system/types'

import { publicProsecutionIndictmentsAccessWhereOptions } from './access'
import { buildHasDefendantWithNullReviewDecisionCondition } from './conditions'

// Public prosecution indictments
// Specific for prosecutors at the public prosecutor office

export const publicProsecutionIndictmentsInReviewWhereOptions = (user: User) => {
  const baseWhereOptions = publicProsecutionIndictmentsAccessWhereOptions(user)

  return {
    ...baseWhereOptions,
    [Op.and]: [
      ...(baseWhereOptions[Op.and] ?? []),
      buildHasDefendantWithNullReviewDecisionCondition(true),
    ],
  }
}

export const publicProsecutionIndictmentsReviewedWhereOptions = (user: User) => {
  const baseWhereOptions = publicProsecutionIndictmentsAccessWhereOptions(user)

  return {
    ...baseWhereOptions,
    [Op.and]: [
      ...(baseWhereOptions[Op.and] ?? []),
      buildHasDefendantWithNullReviewDecisionCondition(false),
    ],
  }
}

// Public prosecution cases access
export const publicProsecutorCasesAccessWhereOptions = (user: User) =>
  publicProsecutionIndictmentsAccessWhereOptions(user)
