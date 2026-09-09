import { Transaction } from 'sequelize'

import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { DateType } from '@island.is/judicial-system/types'

import { DateLog } from '../models/dateLog.model'
import { DateLogRepositoryService } from '../services/dateLogRepository.service'

describe('DateLogRepositoryService', () => {
  const caseId = 'some-case-id'
  const dateType = DateType.ARRAIGNMENT_DATE
  const transaction = {} as Transaction

  // The table has a composite UNIQUE on (case_id, date_type), so every method
  // must address the row by both columns - assert them one by one rather than
  // against a shared object that could hide a dropped key.
  const expectedWhere = { caseId, dateType }

  let service: DateLogRepositoryService
  let model: {
    findOne: jest.Mock
    create: jest.Mock
    update: jest.Mock
    destroy: jest.Mock
  }

  beforeEach(async () => {
    model = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue([0]),
      destroy: jest.fn().mockResolvedValue(0),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(DateLog), useValue: model },
        DateLogRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(DateLogRepositoryService)
  })

  describe('findByCaseAndType', () => {
    it('looks the date log up by both key columns in the caller transaction', async () => {
      const dateLog = { id: 'some-date-log-id' }
      model.findOne.mockResolvedValueOnce(dateLog)

      const result = await service.findByCaseAndType(caseId, dateType, {
        transaction,
      })

      expect(model.findOne).toHaveBeenCalledWith({
        where: expectedWhere,
        transaction,
      })
      expect(result).toBe(dateLog)
    })

    it('returns null when there is no such date log', async () => {
      expect(
        await service.findByCaseAndType(caseId, dateType, { transaction }),
      ).toBeNull()
    })

    it('rethrows when the lookup fails', async () => {
      const error = new Error('Some error')
      model.findOne.mockRejectedValueOnce(error)

      await expect(
        service.findByCaseAndType(caseId, dateType, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('createForCase', () => {
    it('creates the date log with both key columns in the caller transaction', async () => {
      const date = new Date()
      const created = { id: 'some-date-log-id' }
      model.create.mockResolvedValueOnce(created)

      const result = await service.createForCase(
        caseId,
        dateType,
        { date, location: 'Some location' },
        { transaction },
      )

      expect(model.create).toHaveBeenCalledWith(
        { ...expectedWhere, date, location: 'Some location' },
        { transaction },
      )
      expect(result).toBe(created)
    })

    it('rethrows when the creation fails', async () => {
      const error = new Error('Some error')
      model.create.mockRejectedValueOnce(error)

      await expect(
        service.createForCase(caseId, dateType, {}, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('updateByCaseAndType', () => {
    it('scopes the update to both key columns in the caller transaction', async () => {
      const date = new Date()

      await service.updateByCaseAndType(
        caseId,
        dateType,
        { date, location: 'Some location' },
        { transaction },
      )

      expect(model.update).toHaveBeenCalledWith(
        { date, location: 'Some location' },
        { where: expectedWhere, transaction },
      )
    })

    it('rethrows when the update fails', async () => {
      const error = new Error('Some error')
      model.update.mockRejectedValueOnce(error)

      await expect(
        service.updateByCaseAndType(caseId, dateType, {}, { transaction }),
      ).rejects.toThrow(error)
    })
  })

  describe('deleteByCaseAndType', () => {
    it('scopes the delete to both key columns in the caller transaction and reports the row count', async () => {
      model.destroy.mockResolvedValueOnce(1)

      const result = await service.deleteByCaseAndType(caseId, dateType, {
        transaction,
      })

      expect(model.destroy).toHaveBeenCalledWith({
        where: expectedWhere,
        transaction,
      })
      expect(result).toBe(1)
    })

    it('rethrows when the delete fails', async () => {
      const error = new Error('Some error')
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.deleteByCaseAndType(caseId, dateType, { transaction }),
      ).rejects.toThrow(error)
    })
  })
})
