import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { Verdict } from '../models/verdict.model'
import { VerdictRepositoryService } from '../services/verdictRepository.service'

describe('VerdictRepositoryService', () => {
  const caseId = 'some-case-id'
  const newCaseId = 'some-new-case-id'
  const defendantId = 'some-defendant-id'
  const verdictId = 'some-verdict-id'
  const transaction = {} as Transaction

  let service: VerdictRepositoryService
  let model: { update: jest.Mock; findOne: jest.Mock }

  beforeEach(async () => {
    model = {
      update: jest.fn().mockResolvedValue([0]),
      findOne: jest.fn().mockResolvedValue(null),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(Verdict), useValue: model },
        VerdictRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(VerdictRepositoryService)
  })

  describe('findById', () => {
    it('finds the verdict by id within the transaction', async () => {
      const verdict = { id: verdictId } as Verdict
      model.findOne.mockResolvedValueOnce(verdict)

      const result = await service.findById(verdictId, { transaction })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: verdictId },
        transaction,
      })
      expect(result).toBe(verdict)
    })

    it('returns null when no verdict has the id', async () => {
      const result = await service.findById(verdictId)

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: verdictId },
        transaction: undefined,
      })
      expect(result).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findById(verdictId)).rejects.toThrow(error)
    })
  })

  describe('findByExternalPoliceDocumentId', () => {
    const externalPoliceDocumentId = 'some-police-document-id'

    it('finds the verdict by its police document id', async () => {
      const verdict = { id: verdictId } as Verdict
      model.findOne.mockResolvedValueOnce(verdict)

      const result = await service.findByExternalPoliceDocumentId(
        externalPoliceDocumentId,
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: { externalPoliceDocumentId },
      })
      expect(result).toBe(verdict)
    })

    it('returns null when no verdict has the police document id', async () => {
      const result = await service.findByExternalPoliceDocumentId(
        externalPoliceDocumentId,
      )

      expect(result).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByExternalPoliceDocumentId(externalPoliceDocumentId),
      ).rejects.toThrow(error)
    })
  })

  describe('findLatestForDefendant', () => {
    it('finds the most recently created verdict of the defendant', async () => {
      const verdict = { id: verdictId } as Verdict
      model.findOne.mockResolvedValueOnce(verdict)

      const result = await service.findLatestForDefendant(defendantId, {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { defendantId },
        order: [['created', 'DESC']],
        transaction,
      })
      expect(result).toBe(verdict)
    })

    it('returns null when the defendant has no verdict', async () => {
      const result = await service.findLatestForDefendant(defendantId)

      expect(result).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findLatestForDefendant(defendantId)).rejects.toThrow(
        error,
      )
    })
  })

  describe('moveAllForDefendantToCase', () => {
    it('moves the verdicts of the defendant within the case to the new case and reports the row count', async () => {
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

    it('reports zero when the defendant has no verdicts', async () => {
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
