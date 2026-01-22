import { Op } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  EventType,
  User,
} from '@island.is/judicial-system/types'

import {
  districtCourtIndictmentsAccessWhereOptions,
  districtCourtRequestCasesAccessWhereOptions,
} from './access'
import {
  buildAlternativeServiceExistsCondition,
  buildEventLogOrderCondition,
  buildSubpoenaExistsCondition,
} from './conditions'

// District court request cases

export const districtCourtRequestCasesInProgressWhereOptions = (
  user: User,
) => ({
  [Op.and]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    {
      [Op.or]: [
        { state: [CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED] },
        {
          state: completedRequestCaseStates,
          ruling_signature_date: null,
          is_completed_without_ruling: null,
        },
      ],
    },
  ],
})

export const districtCourtRequestCasesAppealedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    {
      state: completedRequestCaseStates,
      appeal_state: CaseAppealState.APPEALED,
    },
  ],
})

export const districtCourtRequestCasesCompletedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    {
      state: completedRequestCaseStates,
      [Op.or]: [
        { ruling_signature_date: { [Op.not]: null } },
        { is_completed_without_ruling: { [Op.not]: null } },
      ],
    },
  ],
})

// District court indictments

export const districtCourtIndictmentsNewWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
      state: [CaseState.SUBMITTED, CaseState.RECEIVED],
      judge_id: null,
    },
  ],
})

export const districtCourtIndictmentsReceivedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
      state: CaseState.RECEIVED,
      judge_id: { [Op.not]: null },
      [Op.and]: [
        buildSubpoenaExistsCondition(false),
        buildAlternativeServiceExistsCondition(false),
      ],
    },
  ],
})

export const districtCourtIndictmentsInProgressWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
      [Op.or]: [
        {
          state: CaseState.RECEIVED,
          [Op.or]: [
            buildSubpoenaExistsCondition(true),
            buildAlternativeServiceExistsCondition(true),
          ],
        },
        { state: CaseState.WAITING_FOR_CANCELLATION },
      ],
    },
  ],
})

export const districtCourtIndictmentsFinalizingWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
      state: completedIndictmentCaseStates,
      indictment_ruling_decision: [
        CaseIndictmentRulingDecision.RULING,
        CaseIndictmentRulingDecision.FINE,
      ],
      [Op.and]: [
        buildEventLogOrderCondition(
          EventType.INDICTMENT_COMPLETED,
          EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
          false,
        ),
      ],
    },
  ],
})

export const districtCourtIndictmentsCompletedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
      state: completedIndictmentCaseStates,
      [Op.not]: {
        indictment_ruling_decision: [
          CaseIndictmentRulingDecision.RULING,
          CaseIndictmentRulingDecision.FINE,
        ],
        [Op.and]: [
          buildEventLogOrderCondition(
            EventType.INDICTMENT_COMPLETED,
            EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
            false,
          ),
        ],
      },
    },
  ],
})
