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
  let model: {
    destroy: jest.Mock
    bulkCreate: jest.Mock
    findAll: jest.Mock
    findOne: jest.Mock
  }

  beforeEach(async () => {
    model = {
      destroy: jest.fn().mockResolvedValue(0),
      bulkCreate: jest.fn().mockResolvedValue([]),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
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
})
