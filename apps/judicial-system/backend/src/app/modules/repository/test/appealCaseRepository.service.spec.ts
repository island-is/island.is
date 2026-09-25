import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCaseType } from '@island.is/judicial-system/types'

import { AppealCase } from '../models/appealCase.model'
import { AppealCaseRepositoryService } from '../services/appealCaseRepository.service'

describe('AppealCaseRepositoryService', () => {
  let service: AppealCaseRepositoryService
  let model: { findOne: jest.Mock }

  beforeEach(async () => {
    model = { findOne: jest.fn().mockResolvedValue(null) }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(AppealCase), useValue: model },
        AppealCaseRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(AppealCaseRepositoryService)
  })

  describe('findById', () => {
    it('reads the appeal case by id in the given transaction', async () => {
      const transaction = {} as never
      const appealCase = { id: 'some-appeal-case-id' }
      model.findOne.mockResolvedValueOnce(appealCase)

      const result = await service.findById('some-appeal-case-id', {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: 'some-appeal-case-id' },
        transaction,
      })
      expect(result).toBe(appealCase)
    })

    it('returns null when there is no such appeal case', async () => {
      const result = await service.findById('some-appeal-case-id')

      expect(model.findOne).toHaveBeenCalledWith({
        where: { id: 'some-appeal-case-id' },
        transaction: undefined,
      })
      expect(result).toBeNull()
    })
  })

  describe('findVerdictAppealByCaseId', () => {
    it('reads the verdict appeal of the case in the given transaction', async () => {
      const transaction = {} as never
      const appealCase = { id: 'some-appeal-case-id' }
      model.findOne.mockResolvedValueOnce(appealCase)

      const result = await service.findVerdictAppealByCaseId('some-case-id', {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', appealType: AppealCaseType.VERDICT },
        transaction,
      })
      expect(result).toBe(appealCase)
    })

    it('returns null when the case has no verdict appeal', async () => {
      const result = await service.findVerdictAppealByCaseId('some-case-id')

      expect(result).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findVerdictAppealByCaseId('some-case-id'),
      ).rejects.toThrow(error)
    })
  })

  describe('existsForRulingFile', () => {
    it('queries on case and ruling file and reports a hit', async () => {
      const transaction = {} as never
      model.findOne.mockResolvedValueOnce({ id: 'some-appeal-case-id' })

      const result = await service.existsForRulingFile(
        'some-case-id',
        'some-ruling-file-id',
        { transaction },
      )

      expect(model.findOne).toHaveBeenCalledWith({
        where: { caseId: 'some-case-id', rulingFileId: 'some-ruling-file-id' },
        transaction,
      })
      expect(result).toBe(true)
    })

    it('reports a miss when the ruling has not been appealed', async () => {
      const result = await service.existsForRulingFile(
        'some-case-id',
        'some-ruling-file-id',
      )

      expect(result).toBe(false)
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.existsForRulingFile('some-case-id', 'some-ruling-file-id'),
      ).rejects.toThrow(error)
    })
  })
})
