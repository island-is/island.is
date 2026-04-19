import { Op, Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'
import { CaseDefendantPoliceCaseNumber } from '../models/caseDefendantPoliceCaseNumber.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'

describe('CaseDefendantPoliceCaseNumberRepositoryService', () => {
  const transaction = {} as Transaction

  let service: CaseDefendantPoliceCaseNumberRepositoryService
  let mockModel: {
    destroy: jest.Mock
    bulkCreate: jest.Mock
    update: jest.Mock
    findAll: jest.Mock
    sequelize: {
      transaction: jest.Mock
    }
  }

  beforeEach(async () => {
    mockModel = {
      destroy: jest.fn().mockResolvedValue(undefined),
      bulkCreate: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue([1]),
      findAll: jest.fn().mockResolvedValue([]),
      sequelize: {
        transaction: jest.fn(async (fn: (t: Transaction) => Promise<void>) => {
          await fn(transaction)
        }),
      },
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        {
          provide: getModelToken(CaseDefendantPoliceCaseNumber),
          useValue: mockModel,
        },
        CaseDefendantPoliceCaseNumberRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(CaseDefendantPoliceCaseNumberRepositoryService)
  })

  describe('replaceUnassignedFromPoliceCaseNumbersArray', () => {
    it('deletes unassigned rows for the case then inserts distinct non-empty numbers', async () => {
      await service.replaceUnassignedFromPoliceCaseNumbersArray(
        'case-id-1',
        ['007-2024-1', '007-2024-1', '007-2024-2', ''],
        { transaction },
      )

      expect(mockModel.destroy).toHaveBeenCalledWith({
        where: {
          caseId: 'case-id-1',
          defendantId: { [Op.is]: null },
        },
        transaction,
      })

      expect(mockModel.bulkCreate).toHaveBeenCalledWith(
        [
          {
            caseId: 'case-id-1',
            defendantId: null,
            policeCaseNumber: '007-2024-1',
          },
          {
            caseId: 'case-id-1',
            defendantId: null,
            policeCaseNumber: '007-2024-2',
          },
        ],
        { transaction },
      )
    })

    it('does not bulkCreate when every entry is empty or whitespace-only after trim', async () => {
      await service.replaceUnassignedFromPoliceCaseNumbersArray(
        'case-id-1',
        ['', '   ', '\t'],
        { transaction },
      )

      expect(mockModel.destroy).toHaveBeenCalled()
      expect(mockModel.bulkCreate).not.toHaveBeenCalled()
    })
  })

  describe('resolvePoliceCaseNumbersForCases', () => {
    it('sets policeCaseNumbers from junction when rows exist', async () => {
      mockModel.findAll.mockResolvedValue([
        { caseId: 'case-a', policeCaseNumber: '007-2' },
        { caseId: 'case-a', policeCaseNumber: '007-1' },
      ])

      let numbers = ['legacy']
      const caseA = {
        id: 'case-a',
        get policeCaseNumbers() {
          return numbers
        },
        setDataValue(key: string, val: unknown) {
          if (key === 'policeCaseNumbers') {
            numbers = val as string[]
          }
        },
      } as unknown as Case

      await service.resolvePoliceCaseNumbersForCases([caseA], { transaction })

      expect(caseA.policeCaseNumbers).toEqual(['007-1', '007-2'])
    })

    it('does not overwrite when junction has no rows for the case', async () => {
      mockModel.findAll.mockResolvedValue([])

      const caseA = {
        id: 'case-a',
        policeCaseNumbers: ['keep-me'],
        setDataValue: jest.fn(),
      } as unknown as Case

      await service.resolvePoliceCaseNumbersForCases([caseA], { transaction })

      expect(caseA.policeCaseNumbers).toEqual(['keep-me'])
      expect(caseA.setDataValue).not.toHaveBeenCalled()
    })
  })

  describe('findDistinctPoliceCaseNumbersByCaseIds', () => {
    it('returns sorted distinct numbers per case id', async () => {
      mockModel.findAll.mockResolvedValue([
        { caseId: 'case-a', policeCaseNumber: '007-2' },
        { caseId: 'case-a', policeCaseNumber: '007-1' },
        { caseId: 'case-a', policeCaseNumber: '007-1' },
        { caseId: 'case-b', policeCaseNumber: '008' },
      ])

      const map = await service.findDistinctPoliceCaseNumbersByCaseIds(
        ['case-a', 'case-b', 'case-c'],
        { transaction },
      )

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: { caseId: ['case-a', 'case-b', 'case-c'] },
        attributes: ['caseId', 'policeCaseNumber'],
        transaction,
      })
      expect(map.get('case-a')).toEqual(['007-1', '007-2'])
      expect(map.get('case-b')).toEqual(['008'])
      expect(map.get('case-c')).toEqual([])
    })
  })

  describe('assignDefendantPoliceCaseNumbers', () => {
    it('bulk-creates links and removes matching unassigned rows', async () => {
      await service.assignDefendantPoliceCaseNumbers('case-1', [
        { defendantId: 'def-a', policeCaseNumber: '007-1' },
        { defendantId: 'def-b', policeCaseNumber: '007-2' },
      ])

      expect(mockModel.sequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockModel.bulkCreate).toHaveBeenCalledWith(
        [
          { caseId: 'case-1', defendantId: 'def-a', policeCaseNumber: '007-1' },
          { caseId: 'case-1', defendantId: 'def-b', policeCaseNumber: '007-2' },
        ],
        { transaction, ignoreDuplicates: true },
      )

      expect(mockModel.destroy).toHaveBeenCalledWith({
        where: {
          caseId: 'case-1',
          defendantId: { [Op.is]: null },
          policeCaseNumber: { [Op.in]: ['007-1', '007-2'] },
        },
        transaction,
      })
    })

    it('does nothing when links array is empty', async () => {
      await service.assignDefendantPoliceCaseNumbers('case-1', [])

      expect(mockModel.sequelize.transaction).not.toHaveBeenCalled()
      expect(mockModel.bulkCreate).not.toHaveBeenCalled()
      expect(mockModel.destroy).not.toHaveBeenCalled()
    })
  })

  describe('moveAssignedRowsToCaseForDefendant', () => {
    it('updates case_id for rows matching fromCaseId and defendantId', async () => {
      await service.moveAssignedRowsToCaseForDefendant(
        'parent-case',
        'split-case',
        'defendant-id',
        { transaction },
      )

      expect(mockModel.update).toHaveBeenCalledWith(
        { caseId: 'split-case' },
        {
          where: {
            caseId: 'parent-case',
            defendantId: 'defendant-id',
          },
          transaction,
        },
      )
    })
  })
})
