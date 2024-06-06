import { Op, WhereOptions } from 'sequelize'

import { ForbiddenException } from '@nestjs/common'

import { formatNationalId } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
  DateType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonSystemUser,
  isProsecutionUser,
  isPublicProsecutorUser,
  RequestSharedWithDefender,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

const getProsecutionUserCasesQueryFilter = (user: User): WhereOptions => {
  const options: WhereOptions = [
    { isArchived: false },
    {
      state: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.WAITING_FOR_CONFIRMATION,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.MAIN_HEARING,
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

  if (user.role === UserRole.PROSECUTOR) {
    options.push({
      type: [...restrictionCases, ...investigationCases, ...indictmentCases],
    })
  } else {
    options.push({ type: indictmentCases })
  }

  return {
    [Op.and]: options,
  }
}

const getPublicProsecutionUserCasesQueryFilter = (): WhereOptions => {
  const options: WhereOptions = [
    { isArchived: false },
    { state: [CaseState.COMPLETED] },
    { type: indictmentCases },
  ]

  return {
    [Op.and]: options,
  }
}

const getDistrictCourtUserCasesQueryFilter = (user: User): WhereOptions => {
  const options: WhereOptions = [
    { isArchived: false },
    {
      [Op.or]: [
        { court_id: { [Op.is]: null } },
        { court_id: user.institution?.id },
      ],
    },
  ]

  if (user.role === UserRole.DISTRICT_COURT_ASSISTANT) {
    options.push(
      { type: indictmentCases },
      {
        state: [
          CaseState.SUBMITTED,
          CaseState.RECEIVED,
          CaseState.MAIN_HEARING,
          CaseState.COMPLETED,
        ],
      },
    )
  } else {
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
                CaseState.RECEIVED,
                CaseState.MAIN_HEARING,
                CaseState.COMPLETED,
              ],
            },
          ],
        },
      ],
    })
  }

  return {
    [Op.and]: options,
  }
}

const getAppealsCourtUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { isArchived: false },
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

const getPrisonSystemStaffUserCasesQueryFilter = (user: User): WhereOptions => {
  const options: WhereOptions = [
    { isArchived: false },
    { state: CaseState.ACCEPTED },
  ]

  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    options.push({
      type: [
        CaseType.CUSTODY,
        CaseType.ADMISSION_TO_FACILITY,
        CaseType.PAROLE_REVOCATION,
        CaseType.TRAVEL_BAN,
      ],
    })
  } else {
    options.push(
      {
        type: [
          CaseType.CUSTODY,
          CaseType.ADMISSION_TO_FACILITY,
          CaseType.PAROLE_REVOCATION,
        ],
      },
      {
        decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
      },
    )
  }

  return { [Op.and]: options }
}

const getDefenceUserCasesQueryFilter = (user: User): WhereOptions => {
  const formattedNationalId = formatNationalId(user.nationalId)
  const options: WhereOptions = [
    { isArchived: false },
    {
      [Op.or]: [
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
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
                    { '$dateLogs.date_type$': DateType.ARRAIGNMENT_DATE },
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
            {
              defender_national_id: {
                [Op.or]: [user.nationalId, formattedNationalId],
              },
            },
          ],
        },
        {
          [Op.and]: [
            { type: indictmentCases },
            {
              state: [
                CaseState.RECEIVED,
                CaseState.MAIN_HEARING,
                CaseState.COMPLETED,
              ],
            },
            {
              '$defendants.defender_national_id$': {
                [Op.or]: [user.nationalId, formattedNationalId],
              },
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

  if (isPrisonSystemUser(user)) {
    return getPrisonSystemStaffUserCasesQueryFilter(user)
  }

  if (isDefenceUser(user)) {
    return getDefenceUserCasesQueryFilter(user)
  }

  if (isPublicProsecutorUser(user)) {
    return getPublicProsecutionUserCasesQueryFilter()
  }

  throw new ForbiddenException(`User ${user.id} does not have access to cases`)
}
