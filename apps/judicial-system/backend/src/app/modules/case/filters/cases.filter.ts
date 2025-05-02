import { Op, Sequelize, WhereOptions } from 'sequelize'

import { ForbiddenException } from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  DateType,
  EventType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  investigationCases,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  RequestSharedWhen,
  RequestSharedWithDefender,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

const getProsecutionUserCasesQueryFilter = (user: User): WhereOptions => {
  const type =
    user.role === UserRole.PROSECUTOR
      ? [...restrictionCases, ...investigationCases, ...indictmentCases]
      : indictmentCases

  const options: WhereOptions = [
    { is_archived: false },
    { type },
    {
      state: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.WAITING_FOR_CONFIRMATION,
        CaseState.SUBMITTED,
        CaseState.WAITING_FOR_CANCELLATION,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
        CaseState.COMPLETED,
      ],
    },
    {
      [Op.or]: [
        { prosecutors_office_id: user.institution?.id },
        { shared_with_prosecutors_office_id: user.institution?.id },
        { indictment_reviewer_id: user.id },
      ],
    },
    {
      [Op.or]: [
        { is_heightened_security_level: { [Op.is]: null } },
        { is_heightened_security_level: false },
        { creating_prosecutor_id: user.id },
        { prosecutor_id: user.id },
      ],
    },
  ]

  return {
    [Op.and]: options,
  }
}

const getPublicProsecutionUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      { type: indictmentCases },
      { state: CaseState.COMPLETED },
      {
        indictment_ruling_decision: [
          CaseIndictmentRulingDecision.FINE,
          CaseIndictmentRulingDecision.RULING,
        ],
      },
      {
        id: {
          [Op.in]: Sequelize.literal(`
            (SELECT case_id
              FROM event_log
              WHERE event_type = '${EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR}')
          `),
        },
      },
    ],
  }
}

const getDistrictCourtUserCasesQueryFilter = (user: User): WhereOptions => {
  const options: WhereOptions = [
    { is_archived: false },
    {
      [Op.or]: [
        { court_id: { [Op.is]: null } },
        { court_id: user.institution?.id },
      ],
    },
  ]

  options.push({
    [Op.or]: [
      {
        [Op.and]: [
          { type: [...restrictionCases, ...investigationCases] },
          {
            state: [
              CaseState.DRAFT,
              CaseState.SUBMITTED,
              CaseState.RECEIVED,
              CaseState.ACCEPTED,
              CaseState.REJECTED,
              CaseState.DISMISSED,
            ],
          },
        ],
      },
      {
        [Op.and]: [
          { type: indictmentCases },
          {
            state: [
              CaseState.SUBMITTED,
              CaseState.WAITING_FOR_CANCELLATION,
              CaseState.RECEIVED,
              CaseState.COMPLETED,
            ],
          },
        ],
      },
    ],
  })

  return {
    [Op.and]: options,
  }
}

const getAppealsCourtUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      { type: [...restrictionCases, ...investigationCases] },
      { state: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED] },
      {
        [Op.or]: [
          {
            appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED],
          },
          {
            [Op.and]: [
              { appeal_state: [CaseAppealState.WITHDRAWN] },
              { appeal_received_by_court_date: { [Op.not]: null } },
            ],
          },
        ],
      },
    ],
  }
}

const getPrisonStaffUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      {
        type: [
          CaseType.CUSTODY,
          CaseType.ADMISSION_TO_FACILITY,
          CaseType.PAROLE_REVOCATION,
        ],
      },
      { state: CaseState.ACCEPTED },
      { decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY] },
    ],
  }
}

const getPrisonAdminUserCasesQueryFilter = (): WhereOptions => {
  return {
    is_archived: false,
    [Op.or]: [
      {
        type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
        state: CaseState.ACCEPTED,
      },
      {
        type: indictmentCases,
        state: CaseState.COMPLETED,
        indictment_ruling_decision: {
          [Op.or]: [
            CaseIndictmentRulingDecision.RULING,
            CaseIndictmentRulingDecision.FINE,
          ],
        },
        indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
        id: {
          [Op.in]: Sequelize.literal(`
            (SELECT case_id
              FROM defendant
              WHERE is_sent_to_prison_admin = true)
          `),
        },
      },
    ],
  }
}

const getDefenceUserCasesQueryFilter = (user: User): WhereOptions => {
  const [normalizedNationalId, formattedNationalId] =
    normalizeAndFormatNationalId(user.nationalId)

  const options: WhereOptions = [
    { is_archived: false },
    {
      [Op.or]: [
        {
          // defender per case
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              defender_national_id: [normalizedNationalId, formattedNationalId],
            },
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    { state: [CaseState.SUBMITTED, CaseState.RECEIVED] },
                    {
                      request_shared_with_defender:
                        RequestSharedWithDefender.READY_FOR_COURT,
                    },
                  ],
                },
                {
                  [Op.and]: [
                    { state: CaseState.RECEIVED },
                    {
                      id: {
                        [Op.in]: Sequelize.literal(`
                          (SELECT case_id
                            FROM date_log
                            WHERE date_type = '${DateType.ARRAIGNMENT_DATE}')
                        `),
                      },
                    },
                  ],
                },
                {
                  state: [
                    CaseState.ACCEPTED,
                    CaseState.REJECTED,
                    CaseState.DISMISSED,
                  ],
                },
              ],
            },
          ],
        },
        {
          // victim lawyer assigned to a case
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              [Op.or]: [
                {
                  // lawyer should get access when sent to court
                  [Op.and]: [
                    {
                      id: {
                        [Op.in]: Sequelize.literal(`
                        (SELECT case_id
                          FROM victim
                          WHERE lawyer_national_id in ('${normalizedNationalId}', '${formattedNationalId}') 
                          AND lawyer_access_to_request = '${RequestSharedWhen.READY_FOR_COURT}')
                      `),
                      },
                    },
                    { state: [CaseState.SUBMITTED, CaseState.RECEIVED] },
                  ],
                },
                {
                  // lawyer should get access when court date is scheduled or when case is concluded
                  [Op.and]: [
                    {
                      id: {
                        [Op.in]: Sequelize.literal(`
                          (SELECT case_id
                            FROM victim
                            WHERE lawyer_national_id in ('${normalizedNationalId}', '${formattedNationalId}') 
                            AND lawyer_access_to_request != '${RequestSharedWhen.OBLIGATED}')
                        `),
                      },
                    },
                    {
                      [Op.or]: [
                        {
                          [Op.and]: [
                            { state: CaseState.RECEIVED },
                            {
                              id: {
                                [Op.in]: Sequelize.literal(`
                                (SELECT case_id
                                  FROM date_log
                                  WHERE date_type = '${DateType.ARRAIGNMENT_DATE}')
                              `),
                              },
                            },
                          ],
                        },
                        {
                          state: [
                            CaseState.ACCEPTED,
                            CaseState.REJECTED,
                            CaseState.DISMISSED,
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // confirmed defender and civil claimants in indictment cases
          [Op.and]: [
            { type: indictmentCases },
            {
              state: [
                CaseState.WAITING_FOR_CANCELLATION,
                CaseState.RECEIVED,
                CaseState.COMPLETED,
              ],
            },
            {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: Sequelize.literal(`
                      (SELECT case_id
                        FROM defendant
                        WHERE defender_national_id in ('${normalizedNationalId}', '${formattedNationalId}')
                          AND is_defender_choice_confirmed = true)
                    `),
                  },
                },
                {
                  id: {
                    [Op.in]: Sequelize.literal(`
                      (SELECT case_id
                        FROM civil_claimant
                        WHERE has_spokesperson = true
                          AND spokesperson_national_id in ('${normalizedNationalId}', '${formattedNationalId}')
                          AND is_spokesperson_confirmed = true)
                    `),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return {
    [Op.and]: options,
  }
}

export const getCasesQueryFilter = (user: User): WhereOptions => {
  if (isProsecutionUser(user)) {
    return getProsecutionUserCasesQueryFilter(user)
  }

  if (isDistrictCourtUser(user)) {
    return getDistrictCourtUserCasesQueryFilter(user)
  }

  if (isCourtOfAppealsUser(user)) {
    return getAppealsCourtUserCasesQueryFilter()
  }

  if (isPrisonStaffUser(user)) {
    return getPrisonStaffUserCasesQueryFilter()
  }

  if (isPrisonAdminUser(user)) {
    return getPrisonAdminUserCasesQueryFilter()
  }

  if (isDefenceUser(user)) {
    return getDefenceUserCasesQueryFilter(user)
  }

  if (isPublicProsecutionOfficeUser(user)) {
    return getPublicProsecutionUserCasesQueryFilter()
  }

  throw new ForbiddenException(`User ${user.id} does not have access to cases`)
}
