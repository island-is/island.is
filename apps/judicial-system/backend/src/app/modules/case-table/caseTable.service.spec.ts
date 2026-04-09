import { getConnectionToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import type { User } from '@island.is/judicial-system/types'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'

import { CaseRepositoryService } from '../repository'
import { CaseTableService } from './caseTable.service'

const prosecutionUser = (id: string): User =>
  ({
    id,
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.DISTRICT_PROSECUTORS_OFFICE },
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
    it('returns case table types for case (access enforced by controller guards)', async () => {
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
