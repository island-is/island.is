import { Op, Sequelize, WhereOptions } from 'sequelize'

import { ForbiddenException } from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseState,
  DateType,
  indictmentCases,
  investigationCases,
  isDefenceUser,
  RequestSharedWhen,
  RequestSharedWithDefender,
  restrictionCases,
} from '@island.is/judicial-system/types'

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
  if (isDefenceUser(user)) {
    return getDefenceUserCasesQueryFilter(user)
  }

  throw new ForbiddenException(`User ${user.id} does not have access to cases`)
}
