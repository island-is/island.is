import { Op } from 'sequelize'

import { type User } from '@island.is/judicial-system/types'

import { publicProsecutionIndictmentsAccessWhereOptions } from './access'

// Public prosecution indictments
// Specific for prosecutors at the public prosecutor office

export const publicProsecutionIndictmentsInReviewWhereOptions = (
  user: User,
) => ({
  ...publicProsecutionIndictmentsAccessWhereOptions(user),
  // indictment_review_decision: null,
})

export const publicProsecutionIndictmentsReviewedWhereOptions = (
  user: User,
) => ({
  ...publicProsecutionIndictmentsAccessWhereOptions(user),
  // indictment_review_decision: { [Op.not]: null },
})

// Public prosecution cases access
export const publicProsecutorCasesAccessWhereOptions = (user: User) =>
  publicProsecutionIndictmentsAccessWhereOptions(user)
