import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { DefendantEventLog } from '../models/defendantEventLog.model'
import { DefendantEventLogRepositoryService } from '../services/defendantEventLogRepository.service'

describe('DefendantEventLogRepositoryService', () => {
  const caseId = 'some-case-id'
  const newCaseId = 'some-new-case-id'
  const defendantId = 'some-defendant-id'
  const transaction = {} as Transaction

  let service: DefendantEventLogRepositoryService
  let model: { update: jest.Mock }

  beforeEach(async () => {
    model = { update: jest.fn().mockResolvedValue([0]) }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(DefendantEventLog), useValue: model },
        DefendantEventLogRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(DefendantEventLogRepositoryService)
  })

  describe('moveAllForDefendantToCase', () => {
    it('moves the event logs of the defendant within the case to the new case and reports the row count', async () => {
      model.update.mockResolvedValueOnce([2])

      const result = await service.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { caseId: newCaseId },
        { where: { caseId, defendantId }, transaction },
      )
      expect(result).toBe(2)
    })

    it('reports zero when the defendant has no event logs', async () => {
      const result = await service.moveAllForDefendantToCase(
        caseId,
        defendantId,
        newCaseId,
        { transaction },
      )

      expect(result).toBe(0)
    })

    it('rethrows when the move fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.moveAllForDefendantToCase(caseId, defendantId, newCaseId, {
          transaction,
        }),
      ).rejects.toThrow(error)
    })
  })
})
