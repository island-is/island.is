import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { LawyerRegistry } from '../models/lawyerRegistry.model'
import {
  LawyerRegistryData,
  LawyerRegistryRepositoryService,
} from '../services/lawyerRegistryRepository.service'

describe('LawyerRegistryRepositoryService', () => {
  const transaction = {} as never

  const lawyer: LawyerRegistryData = {
    name: 'Lögmaður Lögmannsson',
    nationalId: '0000000000',
    email: 'logmadur@example.com',
    phoneNumber: '0000000',
    practice: 'Lögmannsstofan',
    isLitigator: true,
  }

  let service: LawyerRegistryRepositoryService
  let logger: { debug: jest.Mock; error: jest.Mock }
  let model: {
    destroy: jest.Mock
    bulkCreate: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
  }

  beforeEach(async () => {
    logger = { debug: jest.fn(), error: jest.fn() }

    model = {
      destroy: jest.fn().mockResolvedValue(0),
      bulkCreate: jest.fn().mockResolvedValue([]),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(LawyerRegistry), useValue: model },
        LawyerRegistryRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(LawyerRegistryRepositoryService)
  })

  describe('replaceAll', () => {
    it('deletes the existing registry before inserting the new one', async () => {
      const order: string[] = []
      model.destroy.mockImplementationOnce(async () => {
        order.push('destroy')
      })
      model.bulkCreate.mockImplementationOnce(async () => {
        order.push('bulkCreate')

        return []
      })

      await service.replaceAll([lawyer], { transaction })

      expect(order).toEqual(['destroy', 'bulkCreate'])
    })

    it('passes the transaction to both the delete and the insert', async () => {
      await service.replaceAll([lawyer], { transaction })

      expect(model.destroy).toHaveBeenCalledWith({ where: {}, transaction })
      expect(model.bulkCreate).toHaveBeenCalledWith([lawyer], { transaction })
    })

    it('returns the created lawyers', async () => {
      model.bulkCreate.mockResolvedValueOnce([lawyer])

      const result = await service.replaceAll([lawyer], { transaction })

      expect(result).toEqual([lawyer])
    })
  })

  describe('findAll', () => {
    it('returns every lawyer without filtering', async () => {
      model.findAll.mockResolvedValueOnce([lawyer])

      const result = await service.findAll()

      expect(model.findAll).toHaveBeenCalledWith()
      expect(result).toEqual([lawyer])
    })
  })

  describe('findAllLitigators', () => {
    it('filters on isLitigator', async () => {
      model.findAll.mockResolvedValueOnce([lawyer])

      const result = await service.findAllLitigators()

      expect(model.findAll).toHaveBeenCalledWith({
        where: { isLitigator: true },
      })
      expect(result).toEqual([lawyer])
    })
  })

  describe('findByNationalId', () => {
    it('returns the lawyer with the given national id', async () => {
      model.findOne.mockResolvedValueOnce(lawyer)

      const result = await service.findByNationalId(lawyer.nationalId)

      expect(model.findOne).toHaveBeenCalledWith({
        where: { nationalId: lawyer.nationalId },
      })
      expect(result).toEqual(lawyer)
    })

    it('returns null when no lawyer matches', async () => {
      model.findOne.mockResolvedValueOnce(null)

      const result = await service.findByNationalId('9999999999')

      expect(result).toBeNull()
    })
  })

  describe('error handling', () => {
    const error = new Error('Some database error')

    it('logs and rethrows when the delete fails', async () => {
      model.destroy.mockRejectedValueOnce(error)

      await expect(
        service.replaceAll([lawyer], { transaction }),
      ).rejects.toThrow(error)
      expect(model.bulkCreate).not.toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(expect.any(String), { error })
    })

    it('logs and rethrows when the insert fails', async () => {
      model.bulkCreate.mockRejectedValueOnce(error)

      await expect(
        service.replaceAll([lawyer], { transaction }),
      ).rejects.toThrow(error)
      expect(logger.error).toHaveBeenCalledWith(expect.any(String), { error })
    })

    it.each([
      ['findAll', () => service.findAll()],
      ['findAllLitigators', () => service.findAllLitigators()],
    ])('logs and rethrows when %s fails', async (_name, call) => {
      model.findAll.mockRejectedValueOnce(error)

      await expect(call()).rejects.toThrow(error)
      expect(logger.error).toHaveBeenCalledWith(expect.any(String), { error })
    })

    it('logs and rethrows when findByNationalId fails', async () => {
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findByNationalId(lawyer.nationalId)).rejects.toThrow(
        error,
      )
      expect(logger.error).toHaveBeenCalledWith(expect.any(String), { error })
    })

    it('keeps national ids out of the logs', async () => {
      model.findOne.mockRejectedValueOnce(error)

      await expect(service.findByNationalId(lawyer.nationalId)).rejects.toThrow(
        error,
      )

      const logged = [...logger.debug.mock.calls, ...logger.error.mock.calls]
        .flat()
        .map((argument) => JSON.stringify(argument))
        .join(' ')

      expect(logged).not.toContain(lawyer.nationalId)
    })
  })
})
