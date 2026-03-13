import { getConnectionToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import type { User } from '@island.is/judicial-system/types'
import {
  CaseTableType,
  IndictmentCaseReviewDecision,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system/types'

import { CaseRepositoryService } from '../repository'
import { CaseTableService } from './caseTable.service'

const prosecutionUser = (id: string): User =>
  ({
    id,
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE },
  } as User)

const publicProsecutionOfficeUser = (id: string): User =>
  ({
    id,
    role: UserRole.PUBLIC_PROSECUTOR_STAFF,
    institution: {
      id: 'public-prosecutors-office-id',
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    },
  } as User)

describe('CaseTableService', () => {
  let service: CaseTableService
  let mockFindAll: jest.Mock
  let mockFindOne: jest.Mock
  let mockEscape: jest.Mock

  beforeEach(async () => {
    mockFindAll = jest.fn()
    mockFindOne = jest.fn()
    mockEscape = jest.fn((value: string) => `'${value.replace(/'/g, "''")}'`)

    const sequelizeToken = getConnectionToken()

    const module = await Test.createTestingModule({
      providers: [
        CaseTableService,
        {
          provide: CaseRepositoryService,
          useValue: { findAll: mockFindAll, findOne: mockFindOne },
        },
        {
          provide: sequelizeToken,
          useValue: { escape: mockEscape },
        },
      ],
    }).compile()

    service = module.get(CaseTableService)
  })

  describe('getCaseTableRows', () => {
    it('calls findAll with where from caseTableWhereOptions for the given type and user', async () => {
      mockFindAll.mockResolvedValue([])

      const user = prosecutionUser('user-1')
      const type = CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS

      await service.getCaseTableRows(type, user)

      expect(mockFindAll).toHaveBeenCalledTimes(1)
      const call = mockFindAll.mock.calls[0][0]
      expect(call).toHaveProperty('where')
      expect(call).toHaveProperty('attributes')
      expect(call).toHaveProperty('include')
    })

    it('returns rowCount and rows from repository result', async () => {
      const user = prosecutionUser('user-1')
      const type = CaseTableType.PROSECUTION_REQUEST_CASES_IN_PROGRESS

      const mockCase = {
        id: 'case-1',
        type: 'CUSTODY',
        state: 'DRAFT',
        policeCaseNumbers: [],
        defendants: [],
        toJSON: function () {
          return { ...this, toJSON: undefined }
        },
      }

      mockFindAll.mockResolvedValue([mockCase])

      const result = await service.getCaseTableRows(type, user)

      expect(result.rowCount).toBe(1)
      expect(result.rows).toHaveLength(1)
      expect(result.rows[0]).toMatchObject({
        caseId: 'case-1',
        isMyCase: expect.any(Boolean),
        actionOnRowClick: expect.any(String),
        contextMenuActions: expect.any(Array),
        cells: expect.any(Array),
      })
    })

    describe('public prosecution office defendant filtering', () => {
      const buildMockIndictmentCase = () => ({
        id: 'case-1',
        type: 'INDICTMENT',
        state: 'ACCEPTED',
        policeCaseNumbers: ['007-2026'],
        defendants: [
          {
            id: 'def-accept-not-acquitted',
            indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
            verdicts: [
              {
                isAcquittedByPublicProsecutionOffice: false,
                defendantHasRequestedAppeal: false,
              },
            ],
          },
          {
            id: 'def-appeal-not-acquitted',
            indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
            verdicts: [
              {
                isAcquittedByPublicProsecutionOffice: false,
                defendantHasRequestedAppeal: false,
              },
            ],
          },
          {
            id: 'def-accept-acquitted',
            indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
            verdicts: [
              {
                isAcquittedByPublicProsecutionOffice: true,
                defendantHasRequestedAppeal: false,
              },
            ],
          },
          {
            id: 'def-appeal-requested',
            indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
            verdicts: [
              {
                isAcquittedByPublicProsecutionOffice: false,
                defendantHasRequestedAppeal: true,
              },
            ],
          },
        ],
        toJSON: function () {
          return { ...this, toJSON: undefined }
        },
      })

      it('keeps only acquitted defendants on acquitted indictments table', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-1')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_ACQUITTED_INDICTMENTS,
          user,
        )

        expect(result.rowCount).toBe(1)
        expect(result.rows[0].defendantIds).toEqual(['def-accept-acquitted'])
      })

      it('keeps only non-acquitted defendants for non-reviewed tables', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-2')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_NEW,
          user,
        )

        expect(result.rowCount).toBe(2)
        expect(result.rows.map((r) => r.defendantIds?.[0])).toEqual(
          expect.arrayContaining([
            'def-accept-not-acquitted',
            'def-appeal-not-acquitted',
          ]),
        )
        expect(result.rows.map((r) => r.defendantIds?.[0])).not.toContain(
          'def-appeal-requested',
        )
      })

      it('keeps only non-acquitted and non-requested defendants in in-review table', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-2b')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_IN_REVIEW,
          user,
        )

        expect(result.rowCount).toBe(2)
        expect(result.rows.map((r) => r.defendantIds?.[0])).toEqual(
          expect.arrayContaining([
            'def-accept-not-acquitted',
            'def-appeal-not-acquitted',
          ]),
        )
        expect(result.rows.map((r) => r.defendantIds?.[0])).not.toContain(
          'def-appeal-requested',
        )
      })

      it('keeps only ACCEPT and non-acquitted defendants on reviewed table', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-3')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REVIEWED,
          user,
        )

        expect(result.rowCount).toBe(1)
        expect(result.rows[0].defendantIds).toEqual([
          'def-accept-not-acquitted',
        ])
      })

      it('keeps only APPEAL and non-acquitted defendants on appealed table', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-4')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_APPEALED,
          user,
        )

        expect(result.rowCount).toBe(1)
        expect(result.rows[0].defendantIds).toEqual([
          'def-appeal-not-acquitted',
        ])
      })

      it('keeps only defendants with requested appeal on requested-appeal table', async () => {
        const user = publicProsecutionOfficeUser('user-ppo-5')
        mockFindAll.mockResolvedValue([buildMockIndictmentCase()])

        const result = await service.getCaseTableRows(
          CaseTableType.PUBLIC_PROSECUTION_OFFICE_INDICTMENTS_REQUESTED_APPEAL,
          user,
        )

        expect(result.rowCount).toBe(1)
        expect(result.rows[0].defendantIds).toEqual(['def-appeal-requested'])
      })
    })
  })

  describe('searchCases', () => {
    it('calls sequelize.escape with query wrapped in wildcards', async () => {
      mockFindAll.mockResolvedValue([])
      const user = prosecutionUser('user-1')

      await service.searchCases('123', user)

      expect(mockEscape).toHaveBeenCalledWith('%123%')
    })

    it('calls findAll with userAccessWhereOptions and search OR conditions', async () => {
      mockFindAll.mockResolvedValue([])
      const user = prosecutionUser('user-1')

      await service.searchCases('test', user)

      expect(mockFindAll).toHaveBeenCalledTimes(1)
      const call = mockFindAll.mock.calls[0][0]
      expect(call.where).toBeDefined()
      expect(call.attributes).toContain('id')
      expect(call.attributes).toContain('policeCaseNumbers')
      expect(call.limit).toBe(10)
    })

    it('returns rows with matchedField and matchedValue from query', async () => {
      const user = prosecutionUser('user-1')
      const mockCase = {
        id: 'case-1',
        type: 'CUSTODY',
        decision: null,
        policeCaseNumbers: ['456-2024'],
        courtCaseNumber: null,
        appealCaseNumber: null,
        defendants: [{ nationalId: '1', name: 'Defendant' }],
        get: (key: string) =>
          ({ matchedValue: '456-2024', matchedField: 'policeCaseNumbers' }[
            key
          ]),
      }
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('456', user)

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].caseId).toBe('case-1')
      expect(result.rows[0].matchedField).toBe('policeCaseNumbers')
      expect(result.rows[0].matchedValue).toBe('456-2024')
      expect(result.rows[0].caseTableTypes).toEqual([])
    })

    it('sorts exact matches before partial matches', async () => {
      const user = prosecutionUser('user-1')
      const mockCases = [
        {
          id: 'case-1',
          type: 'CUSTODY',
          decision: null,
          policeCaseNumbers: ['123-2024'],
          courtCaseNumber: null,
          appealCaseNumber: null,
          defendants: [],
          get: (key: string) =>
            ({ matchedValue: '123-2024', matchedField: 'policeCaseNumbers' }[
              key
            ]),
        },
        {
          id: 'case-2',
          type: 'CUSTODY',
          decision: null,
          policeCaseNumbers: ['123-2024', '123-x'],
          courtCaseNumber: null,
          appealCaseNumber: null,
          defendants: [],
          get: (key: string) =>
            ({ matchedValue: '123-2024', matchedField: 'policeCaseNumbers' }[
              key
            ]),
        },
      ]
      mockFindAll.mockResolvedValueOnce(mockCases)
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('123-2024', user)

      expect(result.rows).toHaveLength(2)
      const exactIndex = result.rows.findIndex(
        (r) => r.matchedValue === '123-2024' && r.caseId === 'case-1',
      )
      const partialIndex = result.rows.findIndex(
        (r) => r.matchedValue === '123-2024' && r.caseId === 'case-2',
      )
      expect(exactIndex).toBeLessThan(partialIndex)
    })
  })

  describe('getCaseTableTypesForCases', () => {
    it('returns empty map for empty caseIds', async () => {
      const user = prosecutionUser('user-1')

      const result = await service.getCaseTableTypesForCases([], user)

      expect(result.size).toBe(0)
      expect(mockFindAll).not.toHaveBeenCalled()
    })

    it('returns case id to table types map', async () => {
      const user = prosecutionUser('user-1')
      mockFindAll
        .mockResolvedValueOnce([{ id: 'case-1' }])
        .mockResolvedValueOnce([{ id: 'case-1' }, { id: 'case-2' }])
        .mockResolvedValue([])

      const result = await service.getCaseTableTypesForCases(
        ['case-1', 'case-2'],
        user,
      )

      expect(result.get('case-1')).toEqual(
        expect.arrayContaining([expect.any(String), expect.any(String)]),
      )
      expect(result.get('case-2')).toEqual([expect.any(String)])
    })
  })

  describe('getCaseTableMembership', () => {
    it('returns null when user has no access to case', async () => {
      mockFindOne.mockResolvedValue(null)

      const result = await service.getCaseTableMembership(
        'case-1',
        prosecutionUser('user-1'),
      )

      expect(result).toBeNull()
      expect(mockFindAll).not.toHaveBeenCalled()
    })

    it('returns case table types when user has access', async () => {
      mockFindOne.mockResolvedValue({ id: 'case-1' })
      mockFindAll
        .mockResolvedValueOnce([{ id: 'case-1' }])
        .mockResolvedValue([])

      const result = await service.getCaseTableMembership(
        'case-1',
        prosecutionUser('user-1'),
      )

      expect(result).toEqual([expect.any(String)])
    })
  })
})
