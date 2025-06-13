import { Op } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  CaseState,
  EventType,
  indictmentCases,
  type User as TUser,
} from '@island.is/judicial-system/types'

import { buildEventLogExistsCondition } from './conditions'

// public prosecutor indictments
// specific for prosecutors at the public prosecutor office

const publicProsecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  is_archived: false,
  type: indictmentCases,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.FINE,
    CaseIndictmentRulingDecision.RULING,
  ],
  state: [CaseState.COMPLETED],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      true,
    ),
  ],
  indictment_reviewer_id: user.id,
})

export const publicProsecutorIndictmentInReviewWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  indictment_review_decision: null,
})

export const publicProsecutorIndictmentReviewedWhereOptions = (
  user: TUser,
) => ({
  ...publicProsecutorIndictmentSharedWhereOptions(user),
  indictment_review_decision: { [Op.not]: null },
})
