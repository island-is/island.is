import { getConnectionToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  CaseTableType,
  CaseType,
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

const courtOfAppealsUser = (id: string): User =>
  ({
    id,
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    institution: { type: InstitutionType.COURT_OF_APPEALS },
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

    it('returns appealCaseId null for non-COA users', async () => {
      const user = prosecutionUser('user-1')
      const mockCase = {
        id: 'case-1',
        type: 'CUSTODY',
        decision: null,
        policeCaseNumbers: ['456-2024'],
        courtCaseNumber: null,
        appealCase: {
          id: 'appeal-1',
          appealCaseNumber: 'L-1/2024',
          appealState: AppealCaseState.RECEIVED,
          appealReceivedByCourtDate: null,
        },
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
      expect(result.rows[0].appealCaseId).toBeNull()
      expect(result.rows[0].appealCaseNumber).toBe('L-1/2024')
    })
  })

  describe('searchCases for Court of Appeals', () => {
    const buildAppeal = (
      id: string,
      appealCaseNumber: string,
      appealState: AppealCaseState = AppealCaseState.RECEIVED,
      appealReceivedByCourtDate: Date | null = null,
    ) => ({
      id,
      appealCaseNumber,
      appealState,
      appealReceivedByCourtDate,
    })

    const buildSearchCase = (overrides: {
      id?: string
      appealCase?: ReturnType<typeof buildAppeal> | null
      rulingOrderAppealCases?: ReturnType<typeof buildAppeal>[]
      defendants?: { nationalId: string; name: string }[]
      matchedValue?: string
      matchedField?: string
    }) => ({
      id: overrides.id ?? 'case-1',
      type: 'CUSTODY',
      decision: null,
      policeCaseNumbers: ['001-2024'],
      courtCaseNumber: null,
      appealCase: overrides.appealCase ?? null,
      rulingOrderAppealCases: overrides.rulingOrderAppealCases ?? [],
      defendants: overrides.defendants ?? [],
      get: (key: string) =>
        ({
          matchedValue: overrides.matchedValue ?? '001-2024',
          matchedField: overrides.matchedField ?? 'policeCaseNumbers',
        }[key]),
    })

    it('requests rulingOrderAppealCases and extra appealCase fields for COA users', async () => {
      mockFindAll.mockResolvedValue([])
      const user = courtOfAppealsUser('user-1')

      await service.searchCases('test', user)

      const call = mockFindAll.mock.calls[0][0]
      const appealCaseInclude = call.include.find(
        (i: { as: string }) => i.as === 'appealCase',
      )
      expect(appealCaseInclude.attributes).toEqual(
        expect.arrayContaining([
          'id',
          'appealCaseNumber',
          'appealState',
          'appealReceivedByCourtDate',
        ]),
      )
      const rulingOrderInclude = call.include.find(
        (i: { as: string }) => i.as === 'rulingOrderAppealCases',
      )
      expect(rulingOrderInclude).toBeDefined()
      expect(rulingOrderInclude.separate).toBe(true)
      expect(rulingOrderInclude.attributes).toEqual(
        expect.arrayContaining([
          'id',
          'appealCaseNumber',
          'appealState',
          'appealReceivedByCourtDate',
        ]),
      )
    })

    it('emits one row per qualifying appeal with appealCaseId and appealCaseNumber set per row', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: buildAppeal('appeal-cl', 'L-10/2024'),
        rulingOrderAppealCases: [
          buildAppeal('appeal-ro-1', 'L-11/2024'),
          buildAppeal('appeal-ro-2', 'L-12/2024'),
        ],
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(3)
      expect(result.rows.map((r) => r.appealCaseId)).toEqual([
        'appeal-cl',
        'appeal-ro-1',
        'appeal-ro-2',
      ])
      expect(result.rows.map((r) => r.appealCaseNumber)).toEqual([
        'L-10/2024',
        'L-11/2024',
        'L-12/2024',
      ])
      result.rows.forEach((r) => expect(r.caseId).toBe('case-1'))
    })

    it('emits ruling-order rows when case-level appeal is missing', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: null,
        rulingOrderAppealCases: [buildAppeal('appeal-ro-1', 'L-11/2024')],
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].appealCaseId).toBe('appeal-ro-1')
      expect(result.rows[0].appealCaseNumber).toBe('L-11/2024')
    })

    it('filters out non-qualifying appeals by state', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: buildAppeal(
          'appeal-cl',
          'L-10/2024',
          AppealCaseState.APPEALED, // not qualifying
        ),
        rulingOrderAppealCases: [
          buildAppeal(
            'appeal-ro-1',
            'L-11/2024',
            AppealCaseState.WITHDRAWN, // not qualifying — missing received date
            null,
          ),
          buildAppeal('appeal-ro-2', 'L-12/2024', AppealCaseState.COMPLETED),
        ],
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].appealCaseId).toBe('appeal-ro-2')
      expect(result.rows[0].appealCaseNumber).toBe('L-12/2024')
    })

    it('treats WITHDRAWN appeals as qualifying when appealReceivedByCourtDate is set', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: buildAppeal(
          'appeal-cl',
          'L-10/2024',
          AppealCaseState.WITHDRAWN,
          new Date('2024-06-01'),
        ),
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].appealCaseId).toBe('appeal-cl')
    })

    it('expands by defendants × appeals (one row per defendant per appeal)', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: buildAppeal('appeal-cl', 'L-10/2024'),
        rulingOrderAppealCases: [buildAppeal('appeal-ro-1', 'L-11/2024')],
        defendants: [
          { nationalId: '1', name: 'Alice' },
          { nationalId: '2', name: 'Bob' },
        ],
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(4)
      expect(
        result.rows.map((r) => ({
          appealCaseId: r.appealCaseId,
          defendantName: r.defendantName,
        })),
      ).toEqual([
        { appealCaseId: 'appeal-cl', defendantName: 'Alice' },
        { appealCaseId: 'appeal-cl', defendantName: 'Bob' },
        { appealCaseId: 'appeal-ro-1', defendantName: 'Alice' },
        { appealCaseId: 'appeal-ro-1', defendantName: 'Bob' },
      ])
    })

    it('drops the case when no appeals qualify (defensive — access where options should prevent this)', async () => {
      const user = courtOfAppealsUser('user-1')
      const mockCase = buildSearchCase({
        appealCase: buildAppeal(
          'appeal-cl',
          'L-10/2024',
          AppealCaseState.APPEALED,
        ),
        rulingOrderAppealCases: [],
      })
      mockFindAll.mockResolvedValueOnce([mockCase])
      mockFindAll.mockResolvedValue([])

      const result = await service.searchCases('001', user)

      expect(result.rowCount).toBe(0)
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

  describe('getCaseTableRows for Court of Appeals', () => {
    const buildAppeal = (
      id: string,
      appealCaseNumber: string,
      rulingFileId: string | null,
    ) => ({
      id,
      rulingFileId,
      appealState: AppealCaseState.RECEIVED,
      appealRulingDecision: null,
      appealCaseNumber,
      appealReceivedByCourtDate: null,
      appealJudge1: { name: 'Anna Judge' },
    })

    const buildCase = (
      appealCase: ReturnType<typeof buildAppeal> | null,
      rulingOrderAppealCases: ReturnType<typeof buildAppeal>[],
    ) => {
      const fields = {
        id: 'case-1',
        type: CaseType.INDICTMENT,
        decision: null,
        parentCaseId: null,
        policeCaseNumbers: ['001-2026'],
        courtCaseNumber: null,
        court: { name: 'Héraðsdómur Reykjavíkur' },
        defendants: [],
        appealCase,
        rulingOrderAppealCases,
      }

      return {
        ...fields,
        toJSON: () => fields,
      }
    }

    it('emits one row per qualifying appeal — case-level + each ruling-order — with the correct appealCaseId per row', async () => {
      const user = courtOfAppealsUser('user-1')
      const caseLevel = buildAppeal('appeal-case-level', '1/2026', null)
      const rulingOrder1 = buildAppeal('appeal-ro-1', '2/2026', 'rf-1')
      const rulingOrder2 = buildAppeal('appeal-ro-2', '3/2026', 'rf-2')

      mockFindAll.mockResolvedValue([
        buildCase(caseLevel, [rulingOrder1, rulingOrder2]),
      ])

      const result = await service.getCaseTableRows(
        CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
        user,
      )

      expect(result.rowCount).toBe(3)
      expect(result.rows.map((r) => r.caseId)).toEqual([
        'case-1',
        'case-1',
        'case-1',
      ])
      expect(result.rows.map((r) => r.appealCaseId)).toEqual([
        'appeal-case-level',
        'appeal-ro-1',
        'appeal-ro-2',
      ])
    })

    it('cell values reflect the appeal on each row, not always the case-level one', async () => {
      const user = courtOfAppealsUser('user-1')
      const caseLevel = buildAppeal('appeal-case-level', '1/2026', null)
      const rulingOrder = buildAppeal('appeal-ro-1', '2/2026', 'rf-1')

      mockFindAll.mockResolvedValue([buildCase(caseLevel, [rulingOrder])])

      const result = await service.getCaseTableRows(
        CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
        user,
      )

      const caseNumberCellIndex = 0 // first column in COA in-progress table
      const caseLevelCell = result.rows[0].cells[caseNumberCellIndex].value as {
        strList: string[]
      }
      const rulingOrderCell = result.rows[1].cells[caseNumberCellIndex]
        .value as { strList: string[] }

      // The appealCaseNumber is the first entry of strList in the caseNumber cell
      expect(caseLevelCell.strList[0]).toBe('1/2026')
      expect(rulingOrderCell.strList[0]).toBe('2/2026')
    })

    it('emits only ruling-order rows when no case-level appeal qualifies', async () => {
      const user = courtOfAppealsUser('user-1')
      const rulingOrder1 = buildAppeal('appeal-ro-1', '2/2026', 'rf-1')

      mockFindAll.mockResolvedValue([buildCase(null, [rulingOrder1])])

      const result = await service.getCaseTableRows(
        CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
        user,
      )

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].appealCaseId).toBe('appeal-ro-1')
    })

    it('emits only the case-level row when there are no ruling-order appeals', async () => {
      const user = courtOfAppealsUser('user-1')
      const caseLevel = buildAppeal('appeal-case-level', '1/2026', null)

      mockFindAll.mockResolvedValue([buildCase(caseLevel, [])])

      const result = await service.getCaseTableRows(
        CaseTableType.COURT_OF_APPEALS_CASES_IN_PROGRESS,
        user,
      )

      expect(result.rowCount).toBe(1)
      expect(result.rows[0].appealCaseId).toBe('appeal-case-level')
    })
  })
})
