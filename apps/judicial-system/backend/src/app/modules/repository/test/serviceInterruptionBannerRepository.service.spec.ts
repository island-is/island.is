import { InternalServerErrorException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { ServiceInterruptionBanner } from '../models/serviceInterruptionBanner.model'
import {
  SERVICE_INTERRUPTION_BANNER_ID,
  ServiceInterruptionBannerRepositoryService,
} from '../services/serviceInterruptionBannerRepository.service'

describe('ServiceInterruptionBannerRepositoryService', () => {
  let service: ServiceInterruptionBannerRepositoryService
  let logger: { debug: jest.Mock; error: jest.Mock }
  let model: { findByPk: jest.Mock; update: jest.Mock }

  beforeEach(async () => {
    logger = { debug: jest.fn(), error: jest.fn() }
    model = { findByPk: jest.fn(), update: jest.fn() }

    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: LOGGER_PROVIDER, useValue: logger },
        { provide: getModelToken(ServiceInterruptionBanner), useValue: model },
        ServiceInterruptionBannerRepositoryService,
      ],
    }).compile()

    service = moduleRef.get(ServiceInterruptionBannerRepositoryService)
  })

  describe('find', () => {
    it('returns the single settings row', async () => {
      const banner = { id: SERVICE_INTERRUPTION_BANNER_ID }
      model.findByPk.mockResolvedValueOnce(banner)

      const result = await service.find()

      expect(model.findByPk).toHaveBeenCalledWith(
        SERVICE_INTERRUPTION_BANNER_ID,
      )
      expect(result).toBe(banner)
    })

    it('returns null rather than deciding that a missing row is an error', async () => {
      model.findByPk.mockResolvedValueOnce(null)

      const result = await service.find()

      expect(result).toBeNull()
    })

    it('logs and rethrows when the read fails', async () => {
      const error = new Error('Some error')
      model.findByPk.mockRejectedValueOnce(error)

      await expect(service.find()).rejects.toBe(error)

      expect(logger.error).toHaveBeenCalledWith(
        'Error finding service interruption banner settings:',
        { error },
      )
    })
  })

  describe('update', () => {
    it('updates the single settings row and returns it', async () => {
      const updated = { id: SERVICE_INTERRUPTION_BANNER_ID, title: 'Titill' }
      model.update.mockResolvedValueOnce([1, [updated]])

      const result = await service.update({ title: 'Titill' })

      expect(model.update).toHaveBeenCalledWith(
        { title: 'Titill' },
        { where: { id: SERVICE_INTERRUPTION_BANNER_ID }, returning: true },
      )
      expect(result).toBe(updated)
    })

    it('throws a server error when the row is missing', async () => {
      model.update.mockResolvedValueOnce([0, []])

      await expect(service.update({ title: 'Titill' })).rejects.toBeInstanceOf(
        InternalServerErrorException,
      )
    })
  })
})
