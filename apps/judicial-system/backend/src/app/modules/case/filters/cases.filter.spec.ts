import { Op } from 'sequelize'

import {
  appealsCourtRoles,
  CaseAppealState,
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  courtRoles,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { getCasesQueryFilter } from './cases.filter'

describe.skip('getCasesQueryFilter', () => {
  it('should get prosecutor filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
      role: UserRole.PROSECUTOR,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        {
          state: [
            CaseState.NEW,
            CaseState.DRAFT,
            CaseState.SUBMITTED,
            CaseState.RECEIVED,
            CaseState.ACCEPTED,
            CaseState.REJECTED,
            CaseState.DISMISSED,
          ],
        },
        {
          [Op.or]: [
            { creating_prosecutor_id: { [Op.is]: null } },
            { '$creatingProsecutor.institution_id$': 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
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
        {
          type: [
            ...restrictionCases,
            ...investigationCases,
            ...indictmentCases,
          ],
        },
      ],
    })
  })

  it('should get representative filter', () => {
    // Arrange
    const user = {
      id: 'Prosecutor Id',
      role: UserRole.REPRESENTATIVE,
      institution: {
        id: 'Prosecutors Office Id',
        type: InstitutionType.PROSECUTORS_OFFICE,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        {
          state: [
            CaseState.NEW,
            CaseState.DRAFT,
            CaseState.SUBMITTED,
            CaseState.RECEIVED,
            CaseState.ACCEPTED,
            CaseState.REJECTED,
            CaseState.DISMISSED,
          ],
        },
        {
          [Op.or]: [
            { creating_prosecutor_id: { [Op.is]: null } },
            { '$creatingProsecutor.institution_id$': 'Prosecutors Office Id' },
            { shared_with_prosecutors_office_id: 'Prosecutors Office Id' },
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
        { type: indictmentCases },
      ],
    })
  })

  describe.each(courtRoles)('given %s role', (role) => {
    it(`should get ${role} filter`, () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'Court Id', type: InstitutionType.COURT },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { isArchived: false },
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
                      CaseState.RECEIVED,
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
      })
    })
  })

  describe('given ASSISTANT role', () => {
    it(`should get assistant filter`, () => {
      // Arrange
      const user = {
        role: UserRole.ASSISTANT,
        institution: { id: 'Court Id', type: InstitutionType.COURT },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { isArchived: false },
          {
            [Op.or]: [
              { court_id: { [Op.is]: null } },
              { court_id: 'Court Id' },
            ],
          },
          { type: indictmentCases },
          {
            state: [
              CaseState.SUBMITTED,
              CaseState.RECEIVED,
              CaseState.ACCEPTED,
              CaseState.REJECTED,
              CaseState.DISMISSED,
            ],
          },
        ],
      })
    })
  })

  describe.each(appealsCourtRoles)('given %s role', (role) => {
    it('should get high court filter', () => {
      // Arrange
      const user = {
        role,
        institution: { id: 'High Court Id', type: InstitutionType.HIGH_COURT },
      }

      // Act
      const res = getCasesQueryFilter(user as User)

      // Assert
      expect(res).toStrictEqual({
        [Op.and]: [
          { isArchived: false },
          { type: [...restrictionCases, ...investigationCases] },
          {
            state: [
              CaseState.ACCEPTED,
              CaseState.REJECTED,
              CaseState.DISMISSED,
            ],
          },
          {
            appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED],
          },
        ],
      })
    })
  })

  it('should get prison staff filter', () => {
    // Arrange
    const user = {
      id: 'Staff Id',
      role: UserRole.STAFF,
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
        { isArchived: false },
        { state: CaseState.ACCEPTED },
        { type: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY] },
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
      role: UserRole.STAFF,
      institution: {
        id: 'Prison Id',
        type: InstitutionType.PRISON_ADMIN,
      },
    }

    // Act
    const res = getCasesQueryFilter(user as User)

    // Assert
    expect(res).toStrictEqual({
      [Op.and]: [
        { isArchived: false },
        { state: CaseState.ACCEPTED },
        {
          type: [
            CaseType.ADMISSION_TO_FACILITY,
            CaseType.CUSTODY,
            CaseType.TRAVEL_BAN,
          ],
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
                        { state: CaseState.RECEIVED },
                        { court_date: { [Op.not]: null } },
                      ],
                    },
                    { state: completedCaseStates },
                  ],
                },
                { defender_national_id: user.nationalId },
              ],
            },
            {
              [Op.and]: [
                { type: indictmentCases },
                { state: [CaseState.RECEIVED, ...completedCaseStates] },
                {
                  '$defendants.defender_national_id$': user.nationalId,
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
