import { Op, Sequelize } from 'sequelize'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  completedIndictmentCaseStates,
  completedRequestCaseStates,
  courtOfAppealsRoles,
  DateType,
  EventType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  InstitutionType,
  investigationCases,
  publicProsecutionOfficeRoles,
  RequestSharedWithDefender,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { getCasesQueryFilter } from '../cases.filter'

describe('getCasesQueryFilter', () => {
  it('should get prosecutor filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { is_archived: false },
        {
          type: [
            ...restrictionCases,
            ...investigationCases,
            ...indictmentCases,
          ],
        },
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
            { prosecutors_office_id: 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
            { indictment_reviewer_id: 'Prosecutor Id' },
          ],
        },
        {
          [Op.or]: [
            { is_heightened_security_level: { [Op.is]: null } },
            { is_heightened_security_level: false },
            { creating_prosecutor_id: 'Prosecutor Id' },
            { prosecutor_id: 'Prosecutor Id' },
          ],
        },
      ],
    })
  })

  it('should get prosecutor representative filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
      role: UserRole.PROSECUTOR_REPRESENTATIVE,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.POLICE_PROSECUTORS_OFFICE,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { is_archived: false },
        { type: indictmentCases },
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
            { prosecutors_office_id: 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
            { indictment_reviewer_id: 'Prosecutor Id' },
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
      ],
    })
  })

  describe.each([
    UserRole.DISTRICT_COURT_JUDGE,
    UserRole.DISTRICT_COURT_REGISTRAR,
    UserRole.DISTRICT_COURT_ASSISTANT,
  ])('given %s role', (role) => {
    it(`should get ${role} filter`, () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'Court Id', type: InstitutionType.DISTRICT_COURT },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { is_archived: false },
          {
            [Op.or]: [
              { court_id: { [Op.is]: null } },
              { court_id: 'Court Id' },
            ],
          },
          {
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
          },
        ],
      })
    })
  })

  describe.each(courtOfAppealsRoles)('given %s role', (role) => {
    it('should get court of appeals filter', () => {
      // Arrange
      const user = {
        role,
        institution: {
          id: 'Court of Appeals Id',
          type: InstitutionType.COURT_OF_APPEALS,
        },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { is_archived: false },
          { type: [...restrictionCases, ...investigationCases] },
          {
            state: [
              CaseState.ACCEPTED,
              CaseState.REJECTED,
              CaseState.DISMISSED,
            ],
          },
          {
            [Op.or]: [
              {
                appeal_state: [
                  CaseAppealState.RECEIVED,
                  CaseAppealState.COMPLETED,
                ],
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
      })
    })
  })

  describe.each(publicProsecutionOfficeRoles)('given %s role', (role) => {
    it('should get public prosecutor filter', () => {
      // Arrange
      const user = {
        id: 'Public Prosecutor Office Id',
        role,
        institution: {
          id: 'Public Prosecutors Office Id',
          type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
        },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
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
      })
    })
  })

  it('should get prison staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.PRISON,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
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
        {
          decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
        },
      ],
    })
  })

  it('should get prison admin staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.PRISON_SYSTEM_STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.PRISON_ADMIN,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
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
    })
  })

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
                    { state: completedRequestCaseStates },
                  ],
                },
                {
                  defender_national_id: [user.nationalId, user.nationalId],
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
