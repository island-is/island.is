import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { MessageSuspensionCategory } from '@island.is/judicial-system/message'

import { MessageSuspension } from '../models/messageSuspension.model'
import { MessageSuspensionRepositoryService } from '../services/messageSuspensionRepository.service'

describe('MessageSuspensionRepositoryService', () => {
  let service: MessageSuspensionRepositoryService
  let model: { findAll: jest.Mock; update: jest.Mock }

  beforeEach(async () => {
    model = {
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: { debug: jest.fn(), error: jest.fn() },
        },
        { provide: getModelToken(MessageSuspension), useValue: model },
        MessageSuspensionRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(MessageSuspensionRepositoryService)
  })

  describe('findAll', () => {
    it('returns all suspensions ordered by category', async () => {
      const rows = [{ category: MessageSuspensionCategory.COURT }]
      model.findAll.mockResolvedValueOnce(rows)

      const result = await service.findAll()

      expect(model.findAll).toHaveBeenCalledWith({
        order: [['category', 'ASC']],
      })
      expect(result).toBe(rows)
    })
  })

  describe('update', () => {
    it('returns the updated suspension', async () => {
      const updated = {
        category: MessageSuspensionCategory.POLICE,
        suspended: true,
      }
      model.update.mockResolvedValueOnce([1, [updated]])

      const result = await service.update(MessageSuspensionCategory.POLICE, {
        suspended: true,
        modifiedBy: '1234567890',
      })

      expect(model.update).toHaveBeenCalledWith(
        { suspended: true, modifiedBy: '1234567890' },
        { where: { category: MessageSuspensionCategory.POLICE }, returning: true },
      )
      expect(result).toBe(updated)
    })

    it('throws when no row is updated', async () => {
      model.update.mockResolvedValueOnce([0, []])

      await expect(
        service.update(MessageSuspensionCategory.COURT, { suspended: true }),
      ).rejects.toThrow('Could not update message suspension COURT')
    })
  })
})
