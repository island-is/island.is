import { Op, Sequelize } from 'sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseState,
  completedIndictmentCaseStates,
  DateType,
  indictmentCases,
  investigationCases,
  RequestSharedWhen,
  RequestSharedWithDefender,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { getCasesQueryFilter } from '../cases.filter'

describe('getCasesQueryFilter', () => {
  it('should get defender filter', () => {
    // Arrange
    const user = {
      id: 'Defender Id',
      nationalId: 'Defender National Id',
      role: UserRole.DEFENDER,
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { is_archived: false },
        {
          [Op.or]: [
            {
              [Op.and]: [
                { type: [...restrictionCases, ...investigationCases] },
                {
                  defender_national_id: [user.nationalId, user.nationalId],
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
                          WHERE lawyer_national_id in ('${user.nationalId}', '${user.nationalId}') 
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
                            WHERE lawyer_national_id in ('${user.nationalId}', '${user.nationalId}') 
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
              [Op.and]: [
                { type: indictmentCases },
                {
                  state: [
                    CaseState.WAITING_FOR_CANCELLATION,
                    CaseState.RECEIVED,
                    ...completedIndictmentCaseStates,
                  ],
                },
                {
                  [Op.or]: [
                    {
                      id: {
                        [Op.in]: Sequelize.literal(`
                      (SELECT case_id
                        FROM defendant
                        WHERE defender_national_id in ('${user.nationalId}', '${user.nationalId}')
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
                          AND spokesperson_national_id in ('${user.nationalId}', '${user.nationalId}')
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
      ],
    })
  })
})
