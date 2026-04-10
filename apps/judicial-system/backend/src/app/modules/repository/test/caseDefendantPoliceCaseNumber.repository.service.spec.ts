import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import { Op } from 'sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { CaseDefendantPoliceCaseNumber } from '../models/caseDefendantPoliceCaseNumber.model'
import { CaseDefendantPoliceCaseNumberRepositoryService } from '../services/caseDefendantPoliceCaseNumber.repository.service'

describe('CaseDefendantPoliceCaseNumberRepositoryService', () => {
  const transaction = { id: 'tx' } as never

  let service: CaseDefendantPoliceCaseNumberRepositoryService
  let mockModel: {
    destroy: jest.Mock
    bulkCreate: jest.Mock
    update: jest.Mock
  }

  beforeEach(async () => {
    mockModel = {
      destroy: jest.fn().mockResolvedValue(undefined),
      bulkCreate: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue([1]),
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

    it('does not bulkCreate when all numbers are empty after filtering', async () => {
      await service.replaceUnassignedFromPoliceCaseNumbersArray(
        'case-id-1',
        [],
        { transaction },
      )

      expect(mockModel.destroy).toHaveBeenCalled()
      expect(mockModel.bulkCreate).not.toHaveBeenCalled()
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
