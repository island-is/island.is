import { Op } from 'sequelize'

import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  completedRequestCaseStates,
  EventType,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import {
  buildAlternativeServiceExistsCondition,
  buildEventLogExistsCondition,
  buildSubpoenaExistsCondition,
} from './conditions'

// District court request cases

const districtCourtRequestCasesSharedWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
}

export const districtCourtRequestCasesInProgressWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  [Op.or]: [
    { state: [CaseState.DRAFT, CaseState.SUBMITTED, CaseState.RECEIVED] },
    {
      state: completedRequestCaseStates,
      ruling_signature_date: null,
      is_completed_without_ruling: null,
      appeal_state: {
        [Op.or]: [
          null,
          CaseAppealState.RECEIVED,
          CaseAppealState.WITHDRAWN,
          CaseAppealState.COMPLETED,
        ],
      },
    },
  ],
}

export const districtCourtRequestCasesAppealedWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  appeal_state: [CaseAppealState.APPEALED],
}

export const districtCourtRequestCasesCompletedWhereOptions = {
  ...districtCourtRequestCasesSharedWhereOptions,
  state: completedRequestCaseStates,
  [Op.or]: [
    { ruling_signature_date: { [Op.not]: null } },
    { is_completed_without_ruling: { [Op.not]: null } },
  ],
  appeal_state: {
    [Op.or]: [
      null,
      CaseAppealState.RECEIVED,
      CaseAppealState.WITHDRAWN,
      CaseAppealState.COMPLETED,
    ],
  },
}

// District court indictments

const districtCourtIndictmentsSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

export const districtCourtIndictmentsNewWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: [CaseState.SUBMITTED, CaseState.RECEIVED],
  judge_id: null,
}

export const districtCourtIndictmentsReceivedWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.RECEIVED,
  judge_id: { [Op.not]: null },
  [Op.and]: [
    buildSubpoenaExistsCondition(false),
    buildAlternativeServiceExistsCondition(false),
  ],
}

export const districtCourtIndictmentsInProgressWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
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
}

export const districtCourtIndictmentsFinalizingWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
  [Op.and]: [
    buildEventLogExistsCondition(
      EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      false,
    ),
  ],
}

export const districtCourtIndictmentsCompletedWhereOptions = {
  ...districtCourtIndictmentsSharedWhereOptions,
  state: CaseState.COMPLETED,
  [Op.not]: {
    indictment_ruling_decision: [
      CaseIndictmentRulingDecision.RULING,
      CaseIndictmentRulingDecision.FINE,
    ],
    [Op.and]: [
      buildEventLogExistsCondition(
        EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
        false,
      ),
    ],
  },
}
