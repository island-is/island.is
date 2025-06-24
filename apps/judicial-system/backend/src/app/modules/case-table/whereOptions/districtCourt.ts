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
  User,
} from '@island.is/judicial-system/types'

import {
  buildAlternativeServiceExistsCondition,
  buildEventLogExistsCondition,
  buildSubpoenaExistsCondition,
} from './conditions'

// District court request cases

const districtCourtRequestCasesAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: [...restrictionCases, ...investigationCases],
  state: [
    CaseState.DRAFT,
    CaseState.SUBMITTED,
    CaseState.RECEIVED,
    ...completedRequestCaseStates,
  ],
  court_id: user.institution?.id,
})

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
    },
  ],
})

export const districtCourtRequestCasesAppealedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    {
      state: completedRequestCaseStates,
      appeal_state: [CaseAppealState.APPEALED],
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
})

// District court indictments

const districtCourtIndictmentsAccessWhereOptions = (user: User) => ({
  is_archived: false,
  type: indictmentCases,
  state: [
    CaseState.SUBMITTED,
    CaseState.WAITING_FOR_CANCELLATION,
    CaseState.RECEIVED,
    CaseState.COMPLETED,
  ],
  court_id: user.institution?.id,
})

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
    },
  ],
})

export const districtCourtIndictmentsCompletedWhereOptions = (user: User) => ({
  [Op.and]: [
    districtCourtIndictmentsAccessWhereOptions(user),
    {
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
    },
  ],
})

// District court cases access

export const districtCourtCasesAccessWhereOptions = (user: User) => ({
  [Op.or]: [
    districtCourtRequestCasesAccessWhereOptions(user),
    districtCourtIndictmentsAccessWhereOptions(user),
  ],
})
